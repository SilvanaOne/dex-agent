/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";

export default function Privacy() {
  return (
    <section className="relative py-16 dark:bg-jacarta-800 md:py-24">
      <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
        <Image
          width={1920}
          height={789}
          src="/img/gradient_light.jpg"
          alt="gradient"
          className="h-full w-full"
        />
      </picture>
      <div className="container">
        <h1 className="text-center font-display text-4xl font-medium text-jacarta-700 dark:text-white">
          Privacy Policy
        </h1>
        <div className="article-content mx-auto max-w-[48.125rem]">
          <p>
            <strong>Last Updated: February 11, 2025</strong>
          </p>
          <p>
            Silvana.io (<strong>"Silvana"</strong>, <strong>"we"</strong>,{" "}
            <strong>"us"</strong>, or <strong>"our"</strong>) is committed to
            protecting your privacy. This Privacy Policy describes how we
            collect, use, disclose, and safeguard your information when you use
            our website, mobile applications, and other services we provide
            (collectively, the <strong>"Service"</strong>).
          </p>

          <hr className="my-8" />

          <h2
            id="1-information-we-collect"
            className="text-xl font-semibold mt-8 mb-4"
          >
            1. <strong>Information We Collect</strong>
          </h2>

          <h3 className="text-lg font-semibold mt-6 mb-3">
            1.1 Information You Provide
          </h3>

          <h4 className="text-base font-semibold mt-4 mb-2">
            Account Information
          </h4>
          <p>
            When you create an account or use our Service, you may provide us
            with:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Email Address</strong>: Used for account verification and
              communication.
            </li>
            <li>
              <strong>Blockchain Wallet Address</strong>: Your Mina blockchain
              wallet address for transactions.
            </li>
          </ul>

          <hr className="my-8" />

          <h2
            id="2-how-we-use-your-information"
            className="text-xl font-semibold mt-8 mb-4"
          >
            2. <strong>How We Use Your Information</strong>
          </h2>
          <p>We use the collected information to:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Provide and Maintain the Service</strong>: Enable
              transactions, manage accounts, and deliver the requested services.
            </li>
            <li>
              <strong>Personalize Your Experience</strong>: Tailor content,
              recommendations, and marketing to your interests.
            </li>
            <li>
              <strong>Communicate with You</strong>: Send updates, security
              alerts, and support messages.
            </li>
            <li>
              <strong>Ensure Security and Compliance</strong>: Detect, prevent,
              and address fraud, unauthorized activities, and legal compliance.
            </li>
            <li>
              <strong>Analyze and Improve the Service</strong>: Monitor and
              analyze usage and trends to enhance user experience.
            </li>
            <li>
              <strong>Comply with Legal Obligations</strong>: Respond to legal
              requests, enforce our terms, and protect our rights.
            </li>
            <li>
              <strong>Create Anonymized Data</strong>: Generate de-identified or
              aggregated data for research and analysis.
            </li>
          </ul>

          <hr className="my-8" />

          <h2
            id="3-sharing-your-information"
            className="text-xl font-semibold mt-8 mb-4"
          >
            3. <strong>Sharing Your Information</strong>
          </h2>

          <h3 className="text-lg font-semibold mt-6 mb-3">
            3.1 Service Providers
          </h3>
          <p>
            We may share your information with third-party vendors to facilitate
            our Service, such as:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Hosting and Infrastructure Providers</strong>
            </li>
            <li>
              <strong>Analytics and Performance Services</strong>
            </li>
            <li>
              <strong>Customer Support Platforms</strong>
            </li>
            <li>
              <strong>Identity Verification Services</strong>
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">
            3.2 Third-Party Websites and Wallets
          </h3>
          <p>
            Our Service may contain links to third-party websites or allow you
            to interact with third-party wallets. Please note:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Third-Party Websites</strong>: We are not responsible for
              the privacy practices of websites we do not own or control.
            </li>
            <li>
              <strong>Third-Party Wallets</strong>: Interactions with
              third-party wallet providers are governed by their own privacy
              policies and terms.
            </li>
          </ul>

          <hr className="my-8" />

          <h2
            id="4-your-choices-and-rights"
            className="text-xl font-semibold mt-8 mb-4"
          >
            4. <strong>Your Choices and Rights</strong>
          </h2>

          <h3 className="text-lg font-semibold mt-6 mb-3">
            4.1 Access and Update Information
          </h3>
          <p>
            You can access, review, and update your account information on the
            Service. It is your responsibility to ensure that your information
            is accurate and up-to-date.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-3">
            4.2 Communication Preferences
          </h3>
          <p>You may opt out of receiving promotional communications by:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Email</strong>: Following the unsubscribe instructions in
              our emails.
            </li>
          </ul>

          <hr className="my-8" />

          <h2 id="5-security" className="text-xl font-semibold mt-8 mb-4">
            5. <strong>Security</strong>
          </h2>
          <p>
            We prioritize the security of your information and implement
            reasonable administrative, technical, and physical measures to
            protect it. However, please be aware that no method of transmission
            over the internet or electronic storage is completely secure.
          </p>
          <p className="mt-4">
            <strong>Your Responsibilities</strong>:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Wallet Security</strong>: You are responsible for
              maintaining the security of your blockchain wallet and private
              keys.
            </li>
            <li>
              <strong>API Key Confidentiality</strong>: Keep your API key and
              authentication credentials confidential.
            </li>
            <li>
              <strong>Account Activity</strong>: Monitor your account for any
              unauthorized access or activities.
            </li>
          </ul>

          <p className="mt-8">
            <strong>
              Your use of the Service signifies your acknowledgment of this
              Privacy Policy.
            </strong>
          </p>

          <hr className="my-8" />

          <h2
            id="6-childrens-privacy"
            className="text-xl font-semibold mt-8 mb-4"
          >
            6. <strong>Children's Privacy</strong>
          </h2>
          <p>
            Our Service is not intended for individuals under the age of 18. We
            do not knowingly collect personal information from children under
            18. If you become aware that a child has provided us with personal
            data, please contact us immediately, and we will take steps to
            remove such information.
          </p>

          <hr className="my-8" />

          <h2
            id="7-international-data-transfers"
            className="text-xl font-semibold mt-8 mb-4"
          >
            7. <strong>International Data Transfers</strong>
          </h2>
          <p>
            Your information may be transferred to and processed in countries
            other than your country of residence, including the United States.
            These countries may have data protection laws different from those
            in your country.
          </p>
          <p className="mt-4">
            <strong>Compliance and Safeguards</strong>:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              We ensure that appropriate safeguards are in place to protect your
              data.
            </li>
            <li>
              We rely on standard contractual clauses or other legally compliant
              mechanisms for data transfers.
            </li>
          </ul>

          <hr className="my-8" />

          <h2
            id="8-changes-to-this-privacy-policy"
            className="text-xl font-semibold mt-8 mb-4"
          >
            8. <strong>Changes to This Privacy Policy</strong>
          </h2>
          <p>
            We may update our Privacy Policy periodically to reflect changes in
            our practices or for other operational, legal, or regulatory
            reasons. We will notify you of any significant changes by:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Posting the updated policy on this page with a new "Last Updated"
              date.
            </li>
          </ul>
          <p className="mt-4">
            <strong>Your Continued Use</strong>:
          </p>
          <p>
            Your continued use of the Service after any changes to this Privacy
            Policy constitutes your acceptance of the revised policy. We
            encourage you to review this Privacy Policy periodically.
          </p>

          <hr className="my-8" />

          <h2 id="9-contact-us" className="text-xl font-semibold mt-8 mb-4">
            9. <strong>Contact Us</strong>
          </h2>
          <p>
            If you have any questions, concerns, or requests regarding this
            Privacy Policy, please contact us at:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Email</strong>:{" "}
              <a href="mailto:support@silvana.one" className="text-accent">
                support@silvana.one
              </a>
            </li>
          </ul>

          <hr className="my-8" />

          <h2
            id="10-data-retention"
            className="text-xl font-semibold mt-8 mb-4"
          >
            10. <strong>Data Retention</strong>
          </h2>
          <p>
            We retain your personal information only for as long as necessary to
            fulfill the purposes for which we collected it, including:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Legal Obligations</strong>: To comply with legal,
              regulatory, tax, accounting, or reporting requirements.
            </li>
            <li>
              <strong>Business Needs</strong>: To enforce our agreements,
              resolve disputes, and maintain security.
            </li>
          </ul>
          <p className="mt-4">
            When we no longer need your personal data, we will securely delete
            or anonymize it.
          </p>

          <hr className="my-8" />

          <h2
            id="11-use-of-anonymized-data"
            className="text-xl font-semibold mt-8 mb-4"
          >
            11. <strong>Use of Anonymized and Aggregated Data</strong>
          </h2>
          <p>
            We may create anonymized, de-identified, or aggregated data from
            your personal information. This data does not identify you
            personally and may be used for:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Research and Analysis</strong>: Understanding trends and
              improving our Service.
            </li>
            <li>
              <strong>Marketing and Advertising</strong>: Presenting contextual
              information to users.
            </li>
            <li>
              <strong>Any Other Purpose</strong>: As permissible by applicable
              laws.
            </li>
          </ul>

          <hr className="my-8" />

          <h2
            id="12-do-not-track-signals"
            className="text-xl font-semibold mt-8 mb-4"
          >
            12. <strong>Do Not Track Signals</strong>
          </h2>
          <p>
            Our Service does not respond to Do Not Track (DNT) signals.
            Currently, there is no universally accepted standard for DNT
            signals, and we cannot guarantee that we honor them.
          </p>

          <hr className="my-8" />

          <h2
            id="13-public-information-blockchain"
            className="text-xl font-semibold mt-8 mb-4"
          >
            13. <strong>Public Information and Blockchain</strong>
          </h2>
          <p>
            Please note that all transactions on the Mina blockchain are public
            and accessible to anyone. Information published on the blockchain
            may be associated with you or your account.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Transparency</strong>: Your transactions may reveal
              information about you, including your wallet address and
              transaction history.
            </li>
            <li>
              <strong>Third-Party Access</strong>: We cannot control how others
              might use the openly available blockchain information.
            </li>
          </ul>

          <hr className="my-8" />

          <h2
            id="14-legal-bases-processing"
            className="text-xl font-semibold mt-8 mb-4"
          >
            14.{" "}
            <strong>
              Legal Bases for Processing Personal Data (EEA and UK Users)
            </strong>
          </h2>
          <p>
            For individuals in the European Economic Area (EEA) and the United
            Kingdom (UK), we rely on the following legal bases for processing
            your personal data:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Contractual Necessity</strong>: To provide the Service and
              fulfill our obligations to you.
            </li>
            <li>
              <strong>Consent</strong>: Where you have given explicit consent
              for specific processing.
            </li>
            <li>
              <strong>Legitimate Interests</strong>: For our legitimate business
              interests, such as improving our Service and preventing fraud.
            </li>
            <li>
              <strong>Legal Obligation</strong>: To comply with applicable laws
              and regulations.
            </li>
          </ul>

          <hr className="my-8" />

          <h2
            id="15-united-states-persons"
            className="text-xl font-semibold mt-8 mb-4"
          >
            15. <strong>United States persons</strong>
          </h2>
          <p>
            By accepting these Terms, you confirm that you are{" "}
            <strong>not a U.S. Person</strong>.{" "}
            <strong>
              U.S. Persons are strictly prohibited from using Silvana
            </strong>
            . Access or use of the Service by a U.S. Person constitutes a breach
            of these Terms.
          </p>
          <p className="mt-4">
            <strong>Definition of "U.S. Person":</strong>
          </p>
          <p>
            For the purposes of this agreement, a "U.S. Person" means an
            individual who is a citizen of the United States or who resides in
            the United States.
          </p>

          <hr className="my-8" />

          <h2
            id="16-cookies-and-similar-technologies"
            className="text-xl font-semibold mt-8 mb-4"
          >
            16. <strong>Cookies and Similar Technologies</strong>
          </h2>
          <p>
            We use cookies and similar tracking technologies to collect and use
            personal information about you. They help us:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Authenticate Users</strong>: Verify your account and
              device.
            </li>
            <li>
              <strong>Remember Preferences</strong>: Store your settings and
              preferences.
            </li>
            <li>
              <strong>Analyze Usage</strong>: Understand how you use our Service
              to improve performance.
            </li>
            <li>
              <strong>Marketing</strong>: Deliver relevant advertisements and
              measure their effectiveness.
            </li>
          </ul>
          <p className="mt-4">
            You can control or disable cookies through your browser settings.
          </p>

          <hr className="my-8" />

          <h2
            id="17-third-party-services-and-analytics"
            className="text-xl font-semibold mt-8 mb-4"
          >
            17. <strong>Third-Party Services and Analytics</strong>
          </h2>
          <p>
            We may engage third-party companies to perform services on our
            behalf, such as:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Analytics Providers</strong>: To monitor and analyze the
              use of our Service (e.g., Google Analytics).
            </li>
            <li>
              <strong>Advertising Partners</strong>: To serve advertisements and
              manage advertising campaigns.
            </li>
            <li>
              <strong>Payment Processors</strong>: To facilitate transactions
              and payments.
            </li>
          </ul>
          <p className="mt-4">
            These third parties have access to your personal information only to
            perform specific tasks and are obligated not to disclose or use it
            for any other purpose.
          </p>

          <hr className="my-8" />

          <h2
            id="18-user-responsibilities"
            className="text-xl font-semibold mt-8 mb-4"
          >
            18. <strong>User Responsibilities</strong>
          </h2>
          <p>You are responsible for:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Maintaining Accurate Information</strong>: Ensuring that
              your account information is current and accurate.
            </li>
            <li>
              <strong>Account Security</strong>: Safeguarding your account
              credentials and blockchain wallet information.
            </li>
            <li>
              <strong>Compliance</strong>: Using the Service in compliance with
              all applicable laws and regulations.
            </li>
            <li>
              <strong>Content</strong>: Ensuring that any content you provide
              does not violate any laws or third-party rights.
            </li>
          </ul>

          <hr className="my-8" />

          <h2 id="acceptance" className="text-xl font-semibold mt-8 mb-4">
            <strong>
              Your use of the Service signifies your acknowledgment of this
              Privacy Policy.
            </strong>
          </h2>
        </div>
      </div>
    </section>
  );
}
