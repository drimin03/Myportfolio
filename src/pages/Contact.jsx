import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Check, X } from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    organisation: "",
    email: "",
    role: "",
    message: "",
    service: "",
  });
  const [focusedField, setFocusedField] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleFocus = (field) => setFocusedField(field);
  const handleBlur = () => setFocusedField("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Email is required", { 
        position: "top-center",
        style: { 
          borderRadius: "10px", 
          padding: "16px", 
          fontSize: "14px",
          marginTop: "20px"
        }
      });
      return;
    }

    setLoading(true);

    // Show spinner toast immediately - centered
    const spinnerToastId = toast.loading(
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 border-2 border-dotted border-black rounded-full animate-spin"></div>
        <span>IN AIR</span>
      </div>,
      {
        position: "top-center",
        style: { 
          borderRadius: "10px", 
          padding: "16px", 
          fontSize: "14px",
          marginTop: "20px"
        },
      }
    );

    try {
      const formDataToSend = new FormData();
      
      // Add Web3Forms access key
      formDataToSend.append("access_key", "9de0307c-9099-4652-ac76-36fe1d7ddce7");
      
      // Add form data from state
      formDataToSend.append("name", formData.name);
      formDataToSend.append("organisation", formData.organisation);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("role", formData.role);
      formDataToSend.append("message", formData.message);
      formDataToSend.append("service", formData.service);

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSend
      }).then((res) => res.json());

      toast.dismiss(spinnerToastId);

      if (res.success) {
        toast.success(
          <div className="flex items-center gap-2 text-green-500">
            <Check size={20} /> Contact form sent successfully!
          </div>,
          { 
            position: "top-center", 
            duration: 4000,
            style: { 
              borderRadius: "10px", 
              padding: "16px", 
              fontSize: "14px",
              marginTop: "20px"
            }
          }
        );

        setFormData({
          name: "",
          organisation: "",
          email: "",
          role: "",
          message: "",
          service: "",
        });
      } else {
        toast.error(
          <div className="flex items-center gap-2 text-red-500">
            <X size={20} /> Failed to send contact form
          </div>,
          { 
            position: "top-center", 
            duration: 4000,
            style: { 
              borderRadius: "10px", 
              padding: "16px", 
              fontSize: "14px",
              marginTop: "20px"
            }
          }
        );
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(spinnerToastId);

      toast.error(
        <div className="flex items-center gap-2 text-red-500">
          <X size={20} /> Failed to send contact form
        </div>,
        { 
          position: "top-center", 
          duration: 4000,
          style: { 
            borderRadius: "10px", 
            padding: "16px", 
            fontSize: "14px",
            marginTop: "20px"
          }
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fdfdfd] text-black min-h-screen w-full overflow-hidden">
      {/* Responsive Toaster positioning */}
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        containerStyle={{
          top: isLargeScreen ? '50%' : '80px',
          transform: isLargeScreen ? 'translateY(-50%)' : 'none',
          zIndex: 9999
        }}
        toastOptions={{
          style: {
            borderRadius: "10px",
            padding: "16px",
            fontSize: "14px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            maxWidth: '400px'
          }
        }}
      />

      <form
        onSubmit={handleSubmit}
        className="mt-20 sm:mt-24 lg:mt-32 relative flex flex-col lg:flex-row gap-3 lg:gap-6 px-4 sm:px-6 lg:px-10 min-h-screen"
      >
        {/* Left box */}
        <div className="flex flex-col items-start w-full lg:w-1/2 relative mb-8 lg:mb-0">
          <h2 className="top-0 left-0 font-[manrope1] uppercase text-[8vh] sm:text-[12vh] lg:text-[20vh] tracking-tight leading-none animate-fade-in-up">
            Contact
          </h2>
          <p className="p-2 text-[1.5vh] sm:text-[1.8vh] lg:text-[2vh] max-w-full lg:max-w-[80%] animate-fade-in-up-delay">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid
            architecto aspernatur ut placeat ducimus nihil at iure dolor
            distinctio officia dicta error, ipsam vero, eius, quidem fugiat earum
            numquam enim?
          </p>
        </div>

        {/* Right box */}
        <div className="w-full lg:w-1/2 flex flex-col justify-start animate-slide-in-right space-y-6">
          {/* First Row */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {["name", "organisation"].map((field, i) => (
              <div key={i} className="flex flex-col w-full sm:w-1/2 relative group">
                <label
                  className={`text-[12px] sm:text-[14px] transition-all duration-300 ${
                    focusedField === field ? "text-orange-600" : ""
                  }`}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}*
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  onFocus={() => handleFocus(field)}
                  onBlur={handleBlur}
                  className="border-b border-black focus:outline-none bg-transparent py-1 transition-all duration-300"
                />
              </div>
            ))}
          </div>

          {/* Second Row */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6 sm:mt-10">
            {["email", "role"].map((field, i) => (
              <div key={i} className="flex flex-col w-full sm:w-1/2 relative group">
                <label
                  className={`text-[12px] sm:text-[14px] transition-all duration-300 ${
                    focusedField === field ? "text-orange-600" : ""
                  }`}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}*
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  onFocus={() => handleFocus(field)}
                  onBlur={handleBlur}
                  className="border-b border-black focus:outline-none bg-transparent py-1 transition-all duration-300"
                />
              </div>
            ))}
          </div>

          {/* Service */}
          <div className="flex flex-col mt-6 sm:mt-10 relative group">
            <label
              className={`text-[12px] sm:text-[14px] transition-all duration-300 ${
                focusedField === "service" ? "text-orange-600" : ""
              }`}
            >
              Service Interested
            </label>
            <input
              type="text"
              name="service"
              value={formData.service}
              onChange={handleChange}
              onFocus={() => handleFocus("service")}
              onBlur={handleBlur}
              className="border-b border-black focus:outline-none bg-transparent py-1 transition-all duration-300"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col mt-6 sm:mt-10 relative">
            <label
              className={`text-[12px] sm:text-[14px] transition-all duration-300 ${
                focusedField === "message" ? "text-orange-600" : ""
              }`}
            >
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              onFocus={() => handleFocus("message")}
              onBlur={handleBlur}
              className="border-b border-black focus:outline-none bg-transparent py-1 resize-none transition-all duration-300"
              rows="3"
            ></textarea>
          </div>

          {/* Terms + Send */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 sm:mt-10 gap-6">
            <div className="flex items-start text-[10px] sm:text-[12px] order-2 sm:order-1">
              {/* <span className="w-4 h-4 rounded-full bg-gray-300 mr-2 cursor-pointer relative overflow-hidden group flex-shrink-0 mt-0.5"></span>
              <span> */}
                {/* By submitting this form you accept our{" "}
                <a href="#" className="underline ml-1">
                  T&Cs
                </a> */}
              {/* </span> */}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 sm:gap-3 text-[14px] sm:text-[18px] group order-1 sm:order-2 cursor-pointer"
            >
              <div className="relative w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center">
                {loading && (
                  <div className="absolute inset-0 rounded-full border-2 border-dotted border-black animate-spin"></div>
                )}
                {!loading && (
                  <span className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-black"></span>
                )}
              </div>
              
              <div className="relative overflow-hidden">
                {loading ? (
                  <h2 className="font-[manrope3] text-3xl sm:text-5xl lg:text-7xl">
                    {"Sending".split("").map((char, index) => (
                      <span
                        key={index}
                        className="inline-block transition-transform duration-300 ease-out"
                        style={{ 
                          transitionDelay: `${index * 100}ms`,
                          transform: 'translateY(-100%)',
                          animation: `slideDown 0.6s ease-out ${index * 100}ms forwards`
                        }}
                      >
                        {char}
                      </span>
                    ))}
                  </h2>
                ) : (
                  <h2 className="font-[manrope3] text-3xl sm:text-5xl lg:text-7xl">
                    Send
                  </h2>
                )}
              </div>
              
              <style jsx>{`
                @keyframes slideDown {
                  0% {
                    transform: translateY(-100%);
                    opacity: 0;
                  }
                  100% {
                    transform: translateY(0);
                    opacity: 1;
                  }
                }
              `}</style>
            </button>
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 lg:px-10 py-4 border-t border-gray-400 mt-8 gap-2">
        <span className="text-gray-600 text-xs sm:text-sm">
          drimindesign@gmail.com
        </span>
        <span className="text-gray-600 text-xs sm:text-sm font-semibold">
          TSC
        </span>
      </div>

      
    </div>
  );
}

export default Contact;