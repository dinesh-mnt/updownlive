import React from 'react';
import Link from 'next/link';

export default function PrivacyContent() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">1. Introduction</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          UpDownLive Limited ("we", "our", or "us") is committed to protecting your privacy. This Privacy Notice explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Please read this privacy notice carefully. If you do not agree with the terms of this privacy notice, please do not access the site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">2. Information We Collect</h2>
        <h3 className="text-xl font-semibold mb-3 text-brand-black dark:text-white">Personal Data</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          We may collect personally identifiable information that you voluntarily provide to us when you:
        </p>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
          <li>Subscribe to our newsletter</li>
          <li>Submit an enquiry through our contact form</li>
          <li>Register for an account</li>
          <li>Interact with our services</li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          This information may include: name, email address, and any other information you choose to provide.
        </p>

        <h3 className="text-xl font-semibold mb-3 text-brand-black dark:text-white">Automatically Collected Information</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          When you visit our website, we may automatically collect certain information about your device, including:
        </p>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Referring URLs</li>
          <li>Pages viewed and time spent on pages</li>
          <li>Device identifiers</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">3. How We Use Your Information</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          We use the information we collect or receive to:
        </p>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
          <li>Provide, operate, and maintain our website and services</li>
          <li>Send you newsletters and marketing communications (with your consent)</li>
          <li>Respond to your enquiries and provide customer support</li>
          <li>Improve and personalize your experience on our website</li>
          <li>Analyze usage trends and optimize our services</li>
          <li>Detect, prevent, and address technical issues and security threats</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">4. Disclosure of Your Information</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          We may share your information in the following situations:
        </p>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
          <li><strong>Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf (e.g., email delivery, analytics, hosting)</li>
          <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities</li>
          <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business</li>
          <li><strong>With Your Consent:</strong> We may disclose your information for any other purpose with your consent</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">5. Third-Party Services</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Our website may contain links to third-party websites and services, including:
        </p>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
          <li>TradingView widgets and charts</li>
          <li>News API services</li>
          <li>Social media platforms</li>
          <li>Analytics services (Google Analytics, etc.)</li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          These third-party services have their own privacy policies. We are not responsible for the privacy practices of these third parties.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">6. Data Security</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">7. Data Retention</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Notice, unless a longer retention period is required or permitted by law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">8. Your Privacy Rights</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Depending on your location, you may have the following rights regarding your personal information:
        </p>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
          <li><strong>Access:</strong> Request access to your personal information</li>
          <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information</li>
          <li><strong>Objection:</strong> Object to processing of your personal information</li>
          <li><strong>Portability:</strong> Request transfer of your information to another service</li>
          <li><strong>Withdraw Consent:</strong> Withdraw consent for processing where consent was given</li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          To exercise these rights, please contact us through our <Link href="/contact-us" className="text-brand-blue hover:text-blue-600 underline">contact page</Link>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">9. Newsletter Subscriptions</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          If you subscribe to our newsletter, we will use your email address to send you regular updates about market news and analysis. You can unsubscribe at any time by clicking the unsubscribe link in any email we send you.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">10. Children's Privacy</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">11. Changes to This Privacy Notice</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          We may update this Privacy Notice from time to time. We will notify you of any changes by posting the new Privacy Notice on this page and updating the "Last updated" date. You are advised to review this Privacy Notice periodically for any changes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">12. Contact Us</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          If you have any questions about this Privacy Notice or our privacy practices, please contact us through our <Link href="/contact-us" className="text-brand-blue hover:text-blue-600 underline">contact page</Link>.
        </p>
      </section>
    </div>
  );
}
