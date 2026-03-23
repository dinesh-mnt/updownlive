import React from 'react';
import Link from 'next/link';

export default function TermsContent() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">1. Acceptance of Terms</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          By accessing and using UpDownLive ("the Website"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">2. Use License</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Permission is granted to temporarily access the materials (information or software) on UpDownLive's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose or for any public display</li>
          <li>Attempt to reverse engineer any software contained on UpDownLive's website</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
          <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">3. Disclaimer</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          The materials on UpDownLive's website are provided on an 'as is' basis. UpDownLive makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Further, UpDownLive does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">4. Investment Risk Warning</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Trading foreign exchange, cryptocurrencies, commodities, and other financial instruments on margin carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite.
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          The possibility exists that you could sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose. You should be aware of all the risks associated with trading and seek advice from an independent financial advisor if you have any doubts.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">5. Limitations</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          In no event shall UpDownLive or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on UpDownLive's website, even if UpDownLive or a UpDownLive authorized representative has been notified orally or in writing of the possibility of such damage.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">6. Accuracy of Materials</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          The materials appearing on UpDownLive's website could include technical, typographical, or photographic errors. UpDownLive does not warrant that any of the materials on its website are accurate, complete, or current. UpDownLive may make changes to the materials contained on its website at any time without notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">7. Links</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          UpDownLive has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by UpDownLive of the site. Use of any such linked website is at the user's own risk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">8. Modifications</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          UpDownLive may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">9. Governing Law</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">10. Contact Information</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          If you have any questions about these Terms of Service, please contact us through our <Link href="/contact-us" className="text-brand-blue hover:text-blue-600 underline">contact page</Link>.
        </p>
      </section>
    </div>
  );
}
