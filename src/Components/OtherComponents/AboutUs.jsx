import React, { useRef, useState } from "react";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";

const AboutUs = () => {
  const contact = useRef(null);

  const scrollToDiv = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    country: "",
    address: "",
    city: "",
  });

  const [errors, setErrors] = useState({});
  const [formStatus, setFormStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid.";
    if (!formData.message) newErrors.message = "Message is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      ...formData,
      access_key: "b59583da-0476-4d6e-bbfa-1de0535b7527",
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const res = await response.json();
      if (res.success) {
        setFormStatus("Your message has been sent successfully!");
        setTimeout(() => {
          setFormStatus("");
        }, 5000);
        setFormData({
          name: "",
          email: "",
          message: "",
          country: "",
          address: "",
          city: "",
        });
        setErrors({});
      } else {
        setFormStatus("Something went wrong. Please try again.");
        setTimeout(() => {
          setFormStatus("");
        }, 5000);
      }
    } catch (error) {
      setFormStatus("Something went wrong. Please try again.");
      setTimeout(() => {
        setFormStatus("");
      }, 5000);
      console.error(error);
    }
  };
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex flex-col items-center w-full p-5">
        {/* Section 1 */}
        <div className="w-full bg-white py-12 flex flex-col">
          <div className="flex flex-col ml-56 mb-16 items-start">
            <h1 className="text-4xl font-bold text-orange-500 font-[cursive] leading-relaxed">
              We’re Crescenda <br /> An E-Learning Platform <br />
              From India
            </h1>
            <p className="text-gray-500 text-center mt-10">
              We are at your call. We serve you always.
            </p>
          </div>
          <div className="flex pt-16 xl:ml-20 lg:ml-1">
            <div className="relative w-96 h-96 bg-white rounded-tl-none rounded-[250px] rounded-br-none overflow-hidden">
              <img
                src="https://cdn-fnmld.nitrocdn.com/hhfnDcaJAKmTLJAnxyQwWJkccuukmbhJ/assets/images/optimized/rev-1abbd46/www.eleviant.com/wp-content/uploads/2024/02/BLOG-1-banner-feb-28-2024-421x225.png"
                alt="Section 1"
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>
            <div className="ml-1 relative w-96 h-96 bg-white rounded-bl-none rounded-[250px] rounded-tr-none overflow-hidden">
              <img
                src="https://i0.wp.com/www.sutisoft.com/blog/wp-content/uploads/2024/12/Candidate-Sourcing.jpg?fit=640,413&ssl=1"
                alt="Section 1"
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>
            <div className="mt-6 text-orange-500 xl:ml-20 lg:ml-1 flex flex-col items-center w-96">
              <p className="text-2xl font-[cursive] italic">We’re a Team.</p>
              <p className="text-2xl font-[cursive] italic">We’re a Family.</p>
              <p className="text-2xl font-[cursive] italic">We’re Crescenda!</p>
              <p className="text-gray-600 mt-4 p-2">
                Crescenda is an online education platform that delivers video
                courses, programs, and resources for individuals, advertising &
                media specialists, and online marketing professionals.
              </p>
              <button
              onClick={() => scrollToDiv(contact)}
               className="mt-6 bg-orange-500 text-white px-6 py-2 rounded-lg">
                Say Hello
              </button>
            </div>
          </div>
          <div className="flex justify-around pt-28">
            <div className="mt-10 p-5 flex flex-col items-center w-96">
              <h2 className="text-3xl font-bold text-orange-400">
                Customer Insight,
              </h2>
              <h3 className="text-2xl font-semibold text-orange-400 mt-2">
                Professional Support
              </h3>
              <p className="text-gray-600 text-center mt-4 w-3/4">
                Crescenda is an online education platform that delivers video
                courses, programs, and resources for individuals, advertising &
                media specialists, and online marketing professionals.
              </p>
            </div>
            <img
              src="https://res.cloudinary.com/df1rw6pzl/image/upload/v1735300537/n2cqqo7pgl8iys1s2l8w.png"
              alt="Section 2"
              className="w-96 rounded-lg"
            />
          </div>
        </div>

        {/* Section 2 */}
        <div className="w-full bg-gradient-to-b from-yellow-400 to-orange-300 py-12 flex flex-col items-center">
          <div className="flex flex-wrap justify-around mt-6 w-3/4">
            <div className="text-center flex flex-col items-center">
              {/* Replace with actual icons */}
              <HowToRegOutlinedIcon
                style={{ fontSize: "4rem", color: "white" }}
              />
              <h4 className="text-3xl font-bold text-white pt-2">5,679</h4>
              <p className="text-white">Registered Students</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-16 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                />
              </svg>

              <h4 className="text-3xl font-bold text-white pt-2">2,679</h4>
              <p className="text-white">Students Achieved Dreams</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-16 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>

              <h4 className="text-3xl font-bold text-white pt-2">10,000</h4>
              <p className="text-white">Monthly Visits</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <WorkspacePremiumOutlinedIcon
                style={{ fontSize: "4rem", color: "white" }}
              />
              <h4 className="text-3xl font-bold text-white pt-2">#10</h4>
              <p className="text-white">Rank in West Africa</p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="w-full bg-orange-100 py-12 flex flex-col lg:flex-row items-center lg:items-start justify-around">
          {/* Left Side Text */}
          <div className="lg:w-1/3 lg:ml-20 sm:ml-1 px-8 text-center lg:text-left mt-14">
            <h2 className="text-3xl font-bold text-orange-500">
              Meet Our Creative Team
            </h2>
            <p className="text-gray-600 mt-4 leading-relaxed">
              Crescenda is an online education platform that delivers video
              courses, programs, and resources for individuals, advertising &
              media specialists, and online marketing professionals.
            </p>
          </div>

          {/* Right Side Image Grid */}
          <div className="lg:w-1/2 mt-8 lg:mt-0 grid grid-cols-2 lg:grid-cols-3 gap-4 px-8">
            <div className="w-full h-40 bg-transparent rounded-lg">
              <img
                className="rounded-lg h-40"
                src="https://media.istockphoto.com/id/1364917563/photo/businessman-smiling-with-arms-crossed-on-white-background.jpg?s=612x612&w=0&k=20&c=NtM9Wbs1DBiGaiowsxJY6wNCnLf0POa65rYEwnZymrM="
              />
            </div>
            <div className="w-full h-32 bg-white rounded-lg">
              <img
              className="h-32 w-full rounded-lg"
               src="https://media.istockphoto.com/id/1265471148/photo/head-shot-portrait-of-smiling-asian-businesswoman-standing-in-office.jpg?s=612x612&w=0&k=20&c=wWtAkbyXTJh2zhgjEggD6-dcPgYe5YuozIrR_uJwdmY="/>
            </div>
            <div className="w-full h-36 bg-white rounded-lg">
              <img
                className="h-36 rounded-lg"
                src="https://genesishrsolutions.com/wp-content/uploads/2021/08/Business-Woman.jpg"
              />
            </div>
            <div className="w-full h-28 bg-white rounded-lg">
              <img
              className="h-28 w-full rounded-lg"
               src="https://www.ags-relocation.com/wp-content/uploads/sites/6/2023/10/business-woman-and-hr-strategy.jpg"/>
            </div>
            <div className="w-full h-44 bg-white rounded-lg">
              <img
                className="h-44 rounded-lg"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdxgedgJ5eC45niuj1uuHgThM7ElvpaMYHBFeIRORgDVEWAWuFVm3Uf9ajFilznMoUMCo&usqp=CAU"
              />
            </div>
            <div className="w-full h-32 bg-white rounded-lg">
              <img
                className="h-32 rounded-lg"
                src="https://www.umassglobal.edu/-/media/images/17-blog-images/collegis-blog-images/hr-certification_blog-thumb.jpg"
              />
            </div>
          </div>
        </div>
        <div className="w-full bg-gradient-to-b from-yellow-400 to-orange-300 py-12 flex flex-col items-center">
          <h3 className="mt-8 text-3xl font-bold text-white">
            Let’s Build Something Great Together
          </h3>
          <p className="text-gray-50 mt-4">
            Crescenda is an online education platform that delivers video
            <br />
            courses, programs, and resources for individuals.
          </p>
          <button
          onClick={() => scrollToDiv(contact)}
           className="mt-6 bg-white text-orange-500  px-6 py-2 rounded-2xl">
            Let’s Talk!
          </button>
        </div>
      </div>

      <div ref={contact} className="flex flex-col items-center py-12 bg-white">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-orange-500 mb-4">24Hrs On Deck Customer Support</h2>
        <p className="text-gray-600">We are at your call. We serve you always.</p>
      </div>

      <div className="mt-20 w-full max-w-3xl px-6">
      <h3 className="text-2xl font-bold text-orange-500 mb-2">Let’s Talk!</h3>
      <p className="text-gray-500 mb-6">
        We do normally get back within 48hrs. Please leave a message.
      </p>

      {formStatus && (
        <p className="mb-4 text-center text-green-500 font-medium">
          {formStatus}
        </p>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country / Region"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <div>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street Address"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <div>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            placeholder="Your Message"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
    </div>
    </div>
  );
};

export default AboutUs;
