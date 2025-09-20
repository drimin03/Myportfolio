import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const AgencyFAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
  {
    "question": "How much will it cost to build my website/web app?",
    "answer": "The cost depends on the project’s size, complexity, and features. After understanding your requirements, we provide a transparent estimate with no hidden charges. We can work with fixed-price packages or flexible hourly billing based on your needs."
  },
  {
    "question": "How long will the project take from start to launch?",
    "answer": "Timelines vary depending on the scope. A standard website may take 3–6 weeks, while custom web apps can take a few months. We’ll share a clear project plan with milestones so you know exactly what to expect."
  },
  {
    "question": "Can you show us your past work or portfolio?",
    "answer": "Yes! We have a portfolio of websites and web apps across different industries. Our work demonstrates both design creativity and technical expertise. We’re happy to share relevant case studies tailored to your project."
  },
  {
    "question": "Do you also handle both design (UI/UX) and development?",
    "answer": "Absolutely. We provide end-to-end services: research, UI/UX design, front-end and back-end development, and testing. This ensures smooth coordination and a unified vision for your project."
  },
  {
    "question": "Will the website/app be mobile-friendly and responsive?",
    "answer": "Yes, all our projects are built with a mobile-first approach. Your site/app will automatically adapt to different devices and screen sizes for the best user experience."
  },
  {
    "question": "Can you integrate the features or third-party tools we need (payments, CRM, etc.)?",
    "answer": "Definitely. We have experience integrating APIs, payment gateways, CRMs, analytics, booking systems, and more. If you need it, we can make it work seamlessly."
  },
  {
    "question": "Will the website be SEO-friendly and optimized for performance?",
    "answer": "Yes. We follow best practices for SEO, speed, and accessibility. From clean code and fast load times to optimized images and structured data, we ensure your site is ready to rank and perform."
  },
  {
    "question": "Do you provide post-launch support and maintenance?",
    "answer": "Yes, we offer flexible maintenance packages. This includes bug fixes, updates, performance monitoring, and adding new features as your business grows. You’ll never be left alone after launch."
  },
  {
    "question": "Who owns the code, design, and rights after the project is complete?",
    "answer": "You do. Once the project is paid for, you have full ownership of all code, design files, and assets. We simply keep a copy in our archive for future updates or maintenance if you choose to continue with us."
  }
] ;


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-100 px-6 py-3">
        <span className="text-black font-[manrope4] text-sm font-medium">/ ASK US</span>
      </div>
      
      <div className="max-w-6xl  px-9 py-12">
        {/* Title */}
        <h1 className="lg:text-[30vh] text-[10vh] mt-0 leading-32  p-[0] font-[manrope] font-black text-black mb-16">
          FAQs
        </h1>

        {/* FAQ Items */}
        <div className="space-y-0 border-t font-[manrope4] border-gray-300">
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              index={index}
              question={item.question}
              answer={item.answer}
              isOpen={openItems[index]}
              onToggle={() => toggleItem(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const FAQItem = ({ index, question, answer, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-300">
      <button
        onClick={onToggle}
        className="w-full text-left py-8 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 px-4 group"
      >
        <div className="flex items-center space-x-6">
          <span className="text-gray-400 font-mono text-sm min-w-[40px]">
            [{String(index + 1).padStart(2, '0')}]
          </span>
          <h3 className="text-[15px] md:text-xl font-bold text-black group-hover:text-orange-500 transition-colors duration-200">
            {question}
          </h3>
        </div>
        <ChevronDown 
          className={`w-6 h-6 text-gray-600 transition-transform duration-300 ease-in-out ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-8">
          <div className="ml-16">
            <p className="text-gray-700 text-lg leading-relaxed">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyFAQ;