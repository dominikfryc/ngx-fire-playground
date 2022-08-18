const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp({ credential: admin.credential.applicationDefault() });
const webpush = require("web-push");
webpush.setVapidDetails(
  "https://ngx-fire-playground.web.app",
  functions.config().vapid.public,
  functions.config().vapid.private
);
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");

// Angular Universal
const universal = require("./dist/server/main").app();
exports.ssr = functions.https.onRequest(universal);

// Generate notification content
function getNotificationContent(title) {
  return {
    title: title || "Title",
    body: "This is a sample notification",
    actions: [
      {
        action: "internal",
        title: "Resolver"
      },
      {
        action: "external",
        title: "Google"
      }
    ],
    data: {
      onActionClick: {
        default: {
          operation: "focusLastFocusedOrOpen"
        },
        internal: {
          operation: "navigateLastFocusedOrOpen",
          url: "resolver"
        },
        external: {
          operation: "openWindow",
          url: "https://google.com/"
        }
      }
    }
  }
}

// Send Firebase Cloud Message
// curl -X POST -H "Content-Type:application/json" URL -d '{"token":"TOKEN"}'
exports.message = functions.https.onRequest((req, res) => {
  if (!req.body.token) {
    return res.status(400).send("No token provided");
  }
  const message = {
    token: req.body.token,
    webpush: {
      notification: getNotificationContent("Firebase Cloud Message")
    }
  };
  admin.messaging().send(message).then(() => {
    console.log("Message sent");
    return res.send("Message sent");
  }).catch((error) => {
    console.log("Error sending message: ", error.message);
    return res.send("Error sending message: " + error.message);
  });
});

// Send Push Notification
// curl -X POST -H "Content-Type:application/json" URL -d 'SUBSCRIPTION'
exports.push = functions.https.onRequest((req, res) => {
  if (!req.body.endpoint) {
    return res.status(400).send("No subscription provided");
  }
  const message = {
    notification: getNotificationContent("Push Notification")
  };
  webpush.sendNotification(req.body, JSON.stringify(message)).then(() => {
    console.log("Push notification sent");
    return res.send("Push notification sent");
  }).catch((error) => {
    console.log("Error sending push notification: ", error.body);
    return res.send("Error sending push notification: " + error.body);
  });
});

// Disable Billing Account on Budget Limit
exports.disableBilling = functions.pubsub.topic("billing").onPublish(async (message) => {
  const data = message.json;
  if (data.costAmount <= data.budgetAmount) {
    return `No action necessary. (Current cost: ${data.costAmount})`;
  }
  const client = new GoogleAuth({
    scopes: [
      "https://www.googleapis.com/auth/cloud-billing",
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  });
  google.options({ auth: client });
  const projectName = `projects/${process.env.GCLOUD_PROJECT}`;
  const billing = google.cloudbilling("v1").projects;
  const billingInfo = await billing.getBillingInfo({ name: projectName });
  if (billingInfo.data.billingEnabled) {
    await billing.updateBillingInfo({
      name: projectName,
      requestBody: { billingAccountName: "" }
    });
    return `Billing disabled. (Final cost: ${data.costAmount})`;
  } else {
    return "Billing already disabled";
  }
});
