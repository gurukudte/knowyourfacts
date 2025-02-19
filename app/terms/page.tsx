import { Card, CardContent } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <Card className="max-w-3xl w-full shadow-lg bg-white">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Terms & Conditions
          </h1>
          <p className="mt-2 text-gray-600">Effective Date: 19-February-2025</p>

          <section className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600 mt-2">
              By using <strong>KnowYourFacts</strong>, you confirm that you have
              read, understood, and agreed to these Terms & Conditions. If you
              do not agree, please discontinue use immediately.
            </p>
          </section>

          <section className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              2. Use of Services
            </h2>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2">
              <li>You must be at least 13 years old to use our services.</li>
              <li>
                You agree to use <strong>KnowYourFacts</strong> only for lawful
                purposes and not for any unauthorized or harmful activities.
              </li>
            </ul>
          </section>

          <section className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              3. Google Sign-In
            </h2>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2">
              <li>Our app allows you to log in using your Google account.</li>
              <li>
                We access your <strong>name, email, and profile picture</strong>{" "}
                for authentication purposes.
              </li>
              <li>
                We do not share or sell your personal information to third
                parties.
              </li>
            </ul>
          </section>

          <section className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              4. Google Sheets API Usage
            </h2>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2">
              <li>
                <strong>KnowYourFacts</strong> requests access to your Google
                Sheets to automate tasks.
              </li>
              <li>
                We only edit the sheets that you authorize within the app.
              </li>
              <li>
                We do not store or use your data for any purpose other than
                automation.
              </li>
            </ul>
          </section>

          <section className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              5. Data Privacy & Security
            </h2>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2">
              <li>
                We implement security measures to protect your data from
                unauthorized access.
              </li>
              <li>
                Your authentication data is securely managed and not shared with
                third parties.
              </li>
              <li>
                Refer to our <strong>Privacy Policy</strong> for more details on
                data handling.
              </li>
            </ul>
          </section>

          <section className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              6. User Responsibilities
            </h2>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2">
              <li>
                You are responsible for maintaining the security of your Google
                account.
              </li>
              <li>Do not misuse or exploit our app for illegal activities.</li>
              <li>If you detect unauthorized access, report it immediately.</li>
            </ul>
          </section>

          <section className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              7. Limitations of Liability
            </h2>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2">
              <li>
                <strong>KnowYourFacts</strong> is provided "as is" without
                warranties of any kind.
              </li>
              <li>
                We are not responsible for any data loss, service interruptions,
                or unauthorized access beyond our control.
              </li>
              <li>
                We are not liable for damages resulting from the use or
                inability to use our services.
              </li>
            </ul>
          </section>

          <section className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              8. Termination of Service
            </h2>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2">
              <li>
                We reserve the right to restrict or terminate your access if you
                violate these terms.
              </li>
              <li>
                We may modify or discontinue the service without prior notice.
              </li>
            </ul>
          </section>

          <section className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              9. Changes to Terms
            </h2>
            <p className="text-gray-600 mt-2">
              We may update these Terms & Conditions periodically. Continued use
              of our services after changes means you accept the revised terms.
            </p>
          </section>

          <section className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              10. Contact Us
            </h2>
            <p className="text-gray-600 mt-2">
              For any questions, reach out to us at{" "}
              <strong>support@knowyourfacts.com</strong>.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
