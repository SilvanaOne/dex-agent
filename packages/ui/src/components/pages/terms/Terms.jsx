/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";

export default function Terms() {
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
          Terms of Service
        </h1>
        <div className="article-content mx-auto max-w-[48.125rem]">
          <p>
            <strong>Last Updated: February 11, 2025</strong>
          </p>
          <p>
            Welcome to Silvana.io (<strong>"Silvana"</strong>,{" "}
            <strong>"we"</strong>, <strong>"us"</strong>, or{" "}
            <strong>"our"</strong>). These Terms of Service (
            <strong>"Terms"</strong>) govern your access to and use of the
            Silvana website, APIs, mobile applications, and any related services
            (collectively, the <strong>"Service"</strong>). By accessing or
            using our Service, you agree to be bound by these Terms. If you do
            not agree to these Terms, please do not access or use the Service.
          </p>

          <hr className="my-8" />

          <h2
            id="1-acceptance-of-terms"
            className="text-xl font-semibold mt-8 mb-4"
          >
            1. <strong>Acceptance of Terms</strong>
          </h2>
          <p>
            By using the Service, you acknowledge that you have read,
            understood, and agree to be bound by these Terms and our{" "}
            <a href="/privacy" className="text-blue-600 underline">
              Privacy Policy
            </a>
            . You consent to receive electronic communications from us as
            described in our{" "}
            <a
              href="#9-communication-preferences"
              className="text-blue-600 underline"
            >
              Communication Preferences
            </a>{" "}
            section.
          </p>

          <h2
            id="2-modifications-to-terms-and-service"
            className="text-xl font-semibold mt-8 mb-4"
          >
            2. <strong>Modifications to Terms and Service</strong>
          </h2>
          <p>
            We reserve the right to modify or amend these Terms at any time, at
            our sole discretion, by posting the updated Terms on the Service
            without prior notice to you. It is your responsibility to review
            these Terms periodically. Your continued use of the Service after
            any changes constitutes your acceptance of the new Terms.
          </p>
          <h3
            id="modifications-to-the-service"
            className="text-lg font-semibold mt-6 mb-3"
          >
            <strong>Modifications to the Service</strong>
          </h3>
          <p>
            We also reserve the right to modify, suspend, or discontinue,
            temporarily or permanently, the Service or any features or parts
            thereof without prior notice. We will not be liable for any
            modification, suspension, or discontinuance of the Service or any
            part thereof.
          </p>

          <h2 id="3-eligibility" className="text-xl font-semibold mt-8 mb-4">
            3. <strong>Eligibility</strong>
          </h2>
          <p>
            You must be at least the age of majority in your jurisdiction or
            have legal parental or guardian consent to use the Service. By using
            the Service, you represent and warrant that you have the right,
            authority, and capacity to enter into these Terms.
          </p>
          <h3
            id="3-1-restrictions-on-us-persons"
            className="text-lg font-semibold mt-6 mb-3"
          >
            3.1 <strong>Restrictions on U.S. Persons</strong>
          </h3>
          <p>
            By accepting these Terms, you confirm that you are{" "}
            <strong>not a U.S. Person</strong>.{" "}
            <strong>
              U.S. Persons are strictly prohibited from using Silvana
            </strong>
            . Access or use of the Service by a U.S. Person constitutes a breach
            of these Terms.
          </p>
          <p>
            <strong>Definition of "U.S. Person":</strong>
          </p>
          <p>
            For the purposes of this agreement, a "U.S. Person" means an
            individual who is a citizen of the United States or who resides in
            the United States.
          </p>

          <h2
            id="4-use-of-the-service"
            className="text-xl font-semibold mt-8 mb-4"
          >
            4. <strong>Use of the Service</strong>
          </h2>
          <h3
            id="4-1-service-description"
            className="text-lg font-semibold mt-6 mb-3"
          >
            4.1 <strong>Service Description</strong>
          </h3>
          <p>
            Silvana provides a platform that allows users to launch, transfer,
            buy, and sell tokens on the MINA blockchain. The Service facilitates
            transactions between users but does not operate as a broker,
            financial institution, or creditor.
          </p>
          <h3
            id="4-2-user-responsibilities"
            className="text-lg font-semibold mt-6 mb-3"
          >
            4.2 <strong>User Responsibilities</strong>
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Compliance with Laws</strong>: You agree to comply with
              all applicable laws, regulations, and ordinances related to your
              use of the Service.
            </li>
            <li>
              <strong>Compliance with KYC/AML Policies</strong>: You agree to
              provide to Silvana all relevant Know Your Customer (KYC) and
              Anti-Money Laundering (AML) compliance documentation upon request.
              Failure to provide such documentation may result in suspension or
              termination of your access to the Service.
            </li>
            <li>
              <strong>Account Security</strong>: You are responsible for
              maintaining the confidentiality of any non-custodial wallet or
              credentials associated with your use of the Service.
            </li>
            <li>
              <strong>Accurate Information</strong>: You represent and warrant
              that all information you provide to Silvana is accurate, complete,
              and current.
            </li>
          </ul>
          <h3
            id="4-3-permitted-use"
            className="text-lg font-semibold mt-6 mb-3"
          >
            4.3 <strong>Permitted Use</strong>
          </h3>
          <p>
            The only permitted use of the Service is for purposes expressly
            allowed by these Terms. Use of the Service for any other purposes,
            including but not limited to investment, arbitrage, speculation, and
            using tokens or assets for prohibited activities, is prohibited.
          </p>

          <h2 id="5-transactions" className="text-xl font-semibold mt-8 mb-4">
            5. <strong>Transactions</strong>
          </h2>
          <h3
            id="5-1-no-broker-or-fiduciary"
            className="text-lg font-semibold mt-6 mb-3"
          >
            5.1 <strong>No Broker or Fiduciary</strong>
          </h3>
          <p>
            Silvana is not a party to any agreements between users. All
            transactions are conducted on the decentralized MINA blockchain
            using smart contracts and are initiated and confirmed by users.
          </p>
          <h3
            id="5-2-assumption-of-risk"
            className="text-lg font-semibold mt-6 mb-3"
          >
            5.2 <strong>Assumption of Risk</strong>
          </h3>
          <p>
            You acknowledge and agree that there are inherent risks associated
            with blockchain technologies, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Blockchain Transactions</strong>: Transactions are
              irreversible, and Silvana has no control over the MINA blockchain
              or its protocols.
            </li>
            <li>
              <strong>Token Risks</strong>: Tokens may have little or no value
              and may experience extreme price volatility. You assume all risks
              associated with buying, selling, or holding tokens.
            </li>
            <li>
              <strong>Regulatory Risks</strong>: The regulatory framework
              governing blockchain technologies, cryptocurrencies, and tokens is
              unsettled. New regulations or policies may adversely affect the
              Service and the utility of tokens.
            </li>
            <li>
              <strong>Technical Risks</strong>: There are risks associated with
              using Internet and blockchain-based products, including the risk
              of hardware, software, and Internet connections, the risk of
              malicious software introduction, and the risk that third parties
              may obtain unauthorized access to your wallet.
            </li>
          </ul>
          <p>
            You expressly acknowledge and assume all risks associated with using
            the Service.
          </p>
          <h3
            id="5-3-restrictions-on-sales-and-commissions"
            className="text-lg font-semibold mt-6 mb-3"
          >
            5.3 <strong>Restrictions on Sales and Commissions</strong>
          </h3>
          <p>
            Sales of tokens or assets created using the Service on other
            platforms may be restricted at the request of the creator of the
            tokens or assets. Commissions or fees associated with transactions
            may be changed at the discretion of Silvana or the creator.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Taxes</strong>: You are responsible for all applicable
              taxes associated with your transactions through the Service,
              including but not limited to VAT, sales, or any other taxes
              wherever such taxes may arise.
            </li>
          </ul>

          <h2
            id="6-no-investment-advice"
            className="text-xl font-semibold mt-8 mb-4"
          >
            6. <strong>No Investment Advice</strong>
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>General Information</strong>: The content provided on the
              Service is for general informational purposes only.
            </li>
            <li>
              <strong>No Advice</strong>: Silvana does not provide any
              investment, legal, or tax advice. You should consult your own
              professional advisors before engaging in any transaction.
            </li>
          </ul>

          <h2 id="7-user-conduct" className="text-xl font-semibold mt-8 mb-4">
            7. <strong>User Conduct</strong>
          </h2>
          <p>
            You agree not to engage in any of the following prohibited
            activities:
          </p>

          <h3
            id="7-1-prohibited-activities"
            className="text-lg font-semibold mt-6 mb-3"
          >
            7.1 <strong>Prohibited Activities</strong>
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Illegal Activities</strong>: Using the Service for any
              unlawful purpose or in connection with any illegal activities.
            </li>
            <li>
              <strong>Violation of Laws</strong>: Engaging in activities that
              violate any applicable laws or regulations.
            </li>
            <li>
              <strong>Harmful Activities</strong>: Uploading or transmitting
              viruses, worms, or any software intended to damage or alter
              computer systems or data.
            </li>
            <li>
              <strong>Unauthorized Access</strong>: Attempting to gain
              unauthorized access to other users' accounts, the Service, or
              related systems or networks.
            </li>
            <li>
              <strong>Interference</strong>: Interfering with or disrupting the
              integrity or performance of the Service.
            </li>
            <li>
              <strong>Spam</strong>: Distributing unsolicited or unauthorized
              advertising, promotional materials, or any junk mail.
            </li>
            <li>
              <strong>Data Mining</strong>: Using any automated means or
              interface not provided by us to access the Service or to extract
              data.
            </li>
            <li>
              <strong>Impersonation</strong>: Misrepresenting your affiliation
              with a person or entity, or impersonating any person or entity.
            </li>
          </ul>

          <h3
            id="7-2-penalty-for-unauthorized-actions"
            className="text-lg font-semibold mt-6 mb-3"
          >
            7.2 <strong>Penalty for Unauthorized Actions</strong>
          </h3>
          <p>
            Any modification, alteration, replacement, or unauthorized access to
            the code of Silvana or any modification, alteration, or replacement
            of the blockchain transactions created by Silvana (except as
            permitted by the Service) is strictly prohibited. In the event of
            any such modification or alteration, whether intentional or
            unintentional, you shall be liable to pay a penalty of{" "}
            <strong>USD 10,000</strong> for each instance of such action. This
            penalty is in addition to any other legal remedies that may be
            available to Silvana under these Terms or applicable law.
          </p>

          <h2
            id="8-intellectual-property-rights"
            className="text-xl font-semibold mt-8 mb-4"
          >
            8. <strong>Intellectual Property Rights</strong>
          </h2>

          <h3 id="8-1-ownership" className="text-lg font-semibold mt-6 mb-3">
            8.1 <strong>Ownership</strong>
          </h3>
          <p>
            All content, trademarks, logos, and intellectual property on the
            Service are owned by Silvana or its licensors. This includes but is
            not limited to text, graphics, images, software, and the overall
            look and feel of the Service.
          </p>

          <h3
            id="8-2-limited-license"
            className="text-lg font-semibold mt-6 mb-3"
          >
            8.2 <strong>Limited License</strong>
          </h3>
          <p>
            We grant you a limited, non-exclusive, non-transferable,
            royalty-free license to access and use the Service for personal or
            internal business use in accordance with these Terms.
          </p>

          <h3 id="8-3-restrictions" className="text-lg font-semibold mt-6 mb-3">
            8.3 <strong>Restrictions</strong>
          </h3>
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Reverse engineer, decompile, or disassemble any part of the
              Service.
            </li>
            <li>Remove any proprietary notices or labels on the Service.</li>
          </ul>

          <h3
            id="8-4-reporting-intellectual-property-violations"
            className="text-lg font-semibold mt-6 mb-3"
          >
            8.4 <strong>Reporting Intellectual Property Violations</strong>
          </h3>
          <p>
            If you become aware of any violation of copyright, intellectual
            property rights, or licenses related to the Service, you are obliged
            to immediately inform Silvana by contacting{" "}
            <a href="mailto:ip@Silvana.io" className="text-blue-600 underline">
              support@silvana.one
            </a>{" "}
            and providing details of the violation.
          </p>

          <h2
            id="9-communication-preferences"
            className="text-xl font-semibold mt-8 mb-4"
          >
            9. <strong>Communication Preferences</strong>
          </h2>
          <p>
            By creating an account or using the Service, you consent to receive
            electronic communications from Silvana (e.g., via email, push
            notifications, or other electronic means). These communications may
            include notices about your account, legal notices, and other
            information concerning or related to the Service. You agree that any
            notices, agreements, disclosures, or other communications that we
            send to you electronically satisfy any legal communication
            requirements.
          </p>
          <p className="mt-4">
            You may opt out of receiving promotional communications by following
            the unsubscribe instructions provided in communications or by
            contacting us directly. Please note that we may still send you
            transactional or administrative messages related to the Service.
          </p>

          <h2
            id="10-privacy-policy"
            className="text-xl font-semibold mt-8 mb-4"
          >
            10. <strong>Privacy Policy</strong>
          </h2>
          <p>
            Your privacy is important to us. Please review our{" "}
            <a href="/privacy" className="text-blue-600 underline">
              Privacy Policy
            </a>{" "}
            to understand how we collect, use, and disclose information about
            you.
          </p>

          <h2 id="11-disclaimers" className="text-xl font-semibold mt-8 mb-4">
            11. <strong>Disclaimers</strong>
          </h2>

          <h3 id="11-1-no-warranty" className="text-lg font-semibold mt-6 mb-3">
            11.1 <strong>No Warranty</strong>
          </h3>
          <p className="uppercase">
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS
            WITHOUT ANY WARRANTIES OF ANY KIND. Silvana DISCLAIMS ALL
            WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT.
          </p>
          <p className="mt-4">We do not warrant that:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>The Service will meet your requirements.</li>
            <li>
              The Service will be uninterrupted, timely, secure, or error-free.
            </li>
            <li>
              The results obtained from the use of the Service will be accurate
              or reliable.
            </li>
          </ul>

          <h3
            id="11-2-no-liability-for-user-actions"
            className="text-lg font-semibold mt-6 mb-3"
          >
            11.2 <strong>No Liability for User Actions</strong>
          </h3>
          <p>
            Silvana is not responsible for any actions taken by users, including
            the issuance, transfer, purchase, or sale of tokens.
          </p>

          <h3
            id="11-3-third-party-content"
            className="text-lg font-semibold mt-6 mb-3"
          >
            11.3 <strong>Third-Party Content</strong>
          </h3>
          <p>
            The Service may contain links to third-party websites or services,
            which are not owned or controlled by Silvana. We have no control
            over and assume no responsibility for any third-party content,
            privacy policies, or practices.
          </p>

          <h3
            id="11-4-assumption-of-risk"
            className="text-lg font-semibold mt-6 mb-3"
          >
            11.4 <strong>Assumption of Risk</strong>
          </h3>
          <p>You acknowledge and agree that:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Value of Tokens</strong>: The value of tokens is
              subjective and may fluctuate significantly.
            </li>
            <li>
              <strong>Token Functionality</strong>: Tokens may have little or no
              functionality or intrinsic value.
            </li>
            <li>
              <strong>Regulatory Uncertainty</strong>: Laws and regulations
              governing blockchain technologies are uncertain and may adversely
              affect the Service.
            </li>
            <li>
              <strong>Technical Risks</strong>: There are inherent risks
              associated with blockchain technology, including but not limited
              to security risks, system failures, and unauthorized access by
              third parties.
            </li>
          </ul>

          <h2
            id="12-limitation-of-liability"
            className="text-xl font-semibold mt-8 mb-4"
          >
            12. <strong>Limitation of Liability</strong>
          </h2>
          <p className="uppercase">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, Silvana SHALL NOT BE LIABLE
            FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
            DAMAGES, INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, DATA, USE,
            GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE
              SERVICE.
            </li>
            <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE.</li>
            <li>ANY CONTENT OBTAINED FROM THE SERVICE.</li>
            <li>
              UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR
              CONTENT.
            </li>
          </ul>
          <p className="mt-4 uppercase">
            IN NO EVENT SHALL Silvana' TOTAL LIABILITY TO YOU EXCEED THE GREATER
            OF ONE HUNDRED U.S. DOLLARS (USD $100) OR THE AMOUNT YOU PAID TO
            Silvana IN THE PAST SIX MONTHS FOR THE SERVICE GIVING RISE TO THE
            CLAIM.
          </p>

          <h2
            id="13-indemnification"
            className="text-xl font-semibold mt-8 mb-4"
          >
            13. <strong>Indemnification</strong>
          </h2>
          <p>
            You agree to indemnify, defend, and hold harmless Silvana and its
            affiliates, officers, directors, employees, and agents from and
            against any and all claims, liabilities, damages, losses, or
            expenses (including reasonable attorneys' fees and costs) arising
            out of or in any way connected with:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Your access to or use of the Service.</li>
            <li>Your violation of these Terms.</li>
            <li>
              Your violation of any rights of any third party, including
              intellectual property rights.
            </li>
            <li>Your breach of any applicable laws.</li>
          </ul>
          <p className="mt-4">
            You agree that in the event you breach these Terms, you will be
            responsible for reimbursing Silvana for any costs and expenses
            incurred in enforcing these Terms against you.
          </p>

          <h2
            id="14-dispute-resolution-and-arbitration"
            className="text-xl font-semibold mt-8 mb-4"
          >
            14. <strong>Dispute Resolution and Arbitration</strong>
          </h2>

          <h3 className="text-lg font-semibold mt-6 mb-3">
            <strong>Binding Arbitration</strong>
          </h3>
          <p>
            You and Silvana agree to resolve any disputes arising out of or
            relating to these Terms or the Service through binding arbitration,
            rather than in court.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-3">
            <strong>Arbitration Procedures</strong>
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Initiating Arbitration</strong>: To begin an arbitration
              proceeding, you must send a letter requesting arbitration and
              describing your claim to our legal department at{" "}
              <a
                href="mailto:support@silvana.one"
                className="text-blue-600 underline"
              >
                support@silvana.one
              </a>{" "}
              and receive the answer explaining the arbitration process.
            </li>
            <li>
              <strong>Authority of Arbitrator</strong>: The arbitrator has
              exclusive authority to resolve any dispute relating to the
              interpretation, applicability, or enforceability of this
              arbitration agreement.
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">
            <strong>Waiver of Class Actions</strong>
          </h3>
          <p>
            All claims must be brought in the parties' individual capacity and
            not as a plaintiff or class member in any purported class or
            representative proceeding.
          </p>

          <h2
            id="15-governing-law-and-venue"
            className="text-xl font-semibold mt-8 mb-4"
          >
            15. <strong>Governing Law and Venue</strong>
          </h2>
          <p>
            These Terms and any dispute or claim arising out of or in connection
            with them shall be governed by and construed in accordance with the
            laws of the jurisdiction of Silvana, without regard to its conflict
            of law provisions.
          </p>
          <p className="mt-4">
            Any legal action or proceeding arising under these Terms will be
            brought exclusively in the courts located in that jurisdiction and
            subject to the Arbitration clause.
          </p>

          <h2 id="16-termination" className="text-xl font-semibold mt-8 mb-4">
            16. <strong>Termination</strong>
          </h2>
          <p>
            We reserve the right to suspend or terminate your access to the
            Service at any time, without notice, for any reason, including
            violation of these Terms.
          </p>
          <p className="mt-4">
            Upon termination, all provisions which by their nature should
            survive termination shall continue in full force and effect,
            including but not limited to ownership provisions, warranty
            disclaimers, indemnity, and limitations of liability.
          </p>

          <h2 id="17-severability" className="text-xl font-semibold mt-8 mb-4">
            17. <strong>Severability</strong>
          </h2>
          <p>
            If any provision of these Terms is held to be invalid or
            unenforceable, such provision shall be severed, and the remaining
            provisions shall be enforced to the fullest extent under law.
          </p>

          <h2 id="18-survival" className="text-xl font-semibold mt-8 mb-4">
            18. <strong>Survival</strong>
          </h2>
          <p>
            All provisions of these Terms which by their nature should survive
            termination shall survive termination, including but not limited to
            intellectual property rights, disclaimers, indemnity, and
            limitations of liability.
          </p>

          <h2
            id="19-entire-agreement"
            className="text-xl font-semibold mt-8 mb-4"
          >
            19. <strong>Entire Agreement</strong>
          </h2>
          <p>
            These Terms, along with our Privacy Policy and any other legal
            notices published by us on the Service, constitute the entire
            agreement between you and Silvana regarding the Service.
          </p>

          <h2
            id="20-contact-information"
            className="text-xl font-semibold mt-8 mb-4"
          >
            20. <strong>Contact Information</strong>
          </h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>
              <strong>Email</strong>:{" "}
              <a
                href="mailto:support@silvana.one"
                className="text-blue-600 underline"
              >
                support@silvana.one
              </a>
            </li>
          </ul>

          <h2 id="21-assignment" className="text-xl font-semibold mt-8 mb-4">
            21. <strong>Assignment</strong>
          </h2>
          <p>
            You may not assign or transfer any rights or obligations under these
            Terms without our prior written consent. We may assign our rights
            and obligations under these Terms at any time without notice.
          </p>

          <h2 id="22-force-majeure" className="text-xl font-semibold mt-8 mb-4">
            22. <strong>Force Majeure</strong>
          </h2>
          <p>
            Neither we nor you will be liable for any failure or delay in
            performing obligations under these Terms where such failure or delay
            is due to causes beyond reasonable control, including but not
            limited to natural disasters, war, terrorism, riots, embargoes, acts
            of civil or military authorities, or any other similar causes.
          </p>

          <h2 id="23-waiver" className="text-xl font-semibold mt-8 mb-4">
            23. <strong>Waiver</strong>
          </h2>
          <p>
            No waiver of any term of these Terms shall be deemed a further or
            continuing waiver of such term or any other term, and Silvana'
            failure to assert any right or provision under these Terms shall not
            constitute a waiver of such right or provision.
          </p>

          <h2
            id="24-injunctive-relief"
            className="text-xl font-semibold mt-8 mb-4"
          >
            24. <strong>Injunctive Relief</strong>
          </h2>
          <p>
            You agree that any violation or breach of these Terms may cause
            Silvana immediate and irreparable harm and damages; consequently,
            notwithstanding any other provision of these Terms or other
            applicable legal requirements, Silvana has the right to, and may in
            its discretion, obtain temporary restraining orders or preliminary
            injunctions from a court of competent jurisdiction to restrain any
            violation of these Terms.
          </p>

          <h2
            id="25-export-laws-compliance"
            className="text-xl font-semibold mt-8 mb-4"
          >
            25. <strong>Export Laws Compliance</strong>
          </h2>
          <p>
            You agree to comply with all applicable laws regarding the
            transmission of technical data exported from the country in which
            you reside. You represent and warrant that you are not located in a
            country that is subject to a U.S. or other sovereign country embargo
            or that has been designated by the U.S. or other sovereign country
            as a "terrorist supporting" country, and you are not listed on any
            U.S. or other sovereign country's list of prohibited or restricted
            parties.
          </p>

          <h2 id="26-miscellaneous" className="text-xl font-semibold mt-8 mb-4">
            26. <strong>Miscellaneous</strong>
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Headings</strong>: The section headings in these Terms are
              for convenience only and have no legal or contractual effect.
            </li>
            <li>
              <strong>No Third-Party Beneficiaries</strong>: These Terms are
              intended solely for the benefit of the parties and are not
              intended to confer third-party beneficiary rights upon any other
              person or entity.
            </li>
            <li>
              <strong>Operation of the Service</strong>: The Service is operated
              from facilities in various locations. Those who access or use the
              Service from other jurisdictions do so at their own volition and
              are entirely responsible for compliance with all applicable local
              laws and regulations.
            </li>
          </ul>

          <hr className="my-8" />

          <h1
            id="25-export-laws-compliance"
            className="text-xl font-semibold mt-8 mb-4"
          >
            <strong>Acknowledgment</strong>: By using the Service, you
            acknowledge that you have read, understood, and agree to be bound by
            these Terms.
          </h1>
        </div>
      </div>
    </section>
  );
}
