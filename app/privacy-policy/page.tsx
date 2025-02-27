import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-gray-600">Effective Date: 19-February-2025</p>
          <p>
            KnowYourFacts ("we," "our," or "us") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, and
            safeguard your information when you use our application.
          </p>

          <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
          <h3 className="text-xl font-medium">1.1 Google Sign-In Data</h3>
          <p>
            We integrate Google Sign-In to allow you to log in quickly and
            securely. When you sign in using Google, we receive your basic
            profile information, including your name, email address, and profile
            picture.
          </p>

          <h3 className="text-xl font-medium">1.2 Google Sheets Access</h3>
          <p>
            Our application requests access to your Google Sheets via the Google
            Sheets API. We only access and edit Google Sheets that you authorize
            for automation tasks. We do not collect, store, or share your Google
            Sheets data beyond the scope of the app’s intended functionality.
          </p>

          <h2 className="text-2xl font-semibold">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To authenticate your account securely using Google Sign-In.</li>
            <li>
              To access and modify your Google Sheets as per your authorized
              automation tasks.
            </li>
            <li>To improve user experience and enhance app functionality.</li>
          </ul>

          <h2 className="text-2xl font-semibold">3. Data Security & Privacy</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We use industry-standard encryption to protect your data.</li>
            <li>
              We do not store or share your Google Sheets content outside the
              application.
            </li>
            <li>
              Your Google authentication tokens are securely managed and not
              shared with third parties.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold">4. Third-Party Services</h2>
          <p>
            KnowYourFacts integrates with Google services, and their use is
            subject to Google’s Privacy Policy. You can review Google’s Privacy
            Policy here:
            <Link
              href="https://policies.google.com/privacy"
              className="text-blue-500 underline"
            >
              {" "}
              Google Privacy Policy
            </Link>
          </p>

          <h2 className="text-2xl font-semibold">
            5. Your Choices and Controls
          </h2>
          <p>
            You can revoke our app’s access to your Google Account at any time
            via your Google Account settings:
            <Link
              href="https://myaccount.google.com/permissions"
              className="text-blue-500 underline"
            >
              {" "}
              Google Account Settings
            </Link>
          </p>
          <p>
            If you wish to delete your account and associated data, please
            contact us at [Insert Contact Email].
          </p>

          <h2 className="text-2xl font-semibold">6. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted within the app and on our website with an updated
            effective date.
          </p>

          <h2 className="text-2xl font-semibold">7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, you can contact
            us at:
            <br />
            [Insert Contact Email]
          </p>

          <p>
            By using KnowYourFacts, you agree to the terms outlined in this
            Privacy Policy.
          </p>

          {/* <Button className="mt-4">Accept & Continue</Button> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
