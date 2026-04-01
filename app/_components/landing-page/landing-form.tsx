"use client";

import { RefObject, useEffect, useState } from "react";
import React from "react";
import JoinDetails from "./join-details";
import { z } from "zod";
import { registerapi } from "./api/api";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-phone-number-input/style.css";
import "./phone-input.css";
import { GoDotFill } from "react-icons/go";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  looking_for: z.string().min(1, "Looking for is required"),
  userName: z.string().min(1, "Name is required"),
  dateOfBirth: z.string().min(1, "Date of Birth Required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z
    .string()
    .regex(
      /^\+[1-9]\d{9,14}$/,
      "Phone number must be in international format (e.g., +1234567890), up to 15 digits"
    )
    .optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  isAggredTandC: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  }),
});

const LandingForm = (props: { ref: RefObject<HTMLDivElement | null> }) => {
  const router = useRouter();
  const [formdata, setFormData] = useState({
    looking_for: "",
    userName: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    password: "",
    isAggredTandC: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async () => {
    const fetchapi = async (data: any) => {
      const fetch = await registerapi(data);
      // console.log("breathing", fetch?.data.status);
      return { status: fetch?.data.status, code: fetch?.data.code };
    };

    const result = formSchema.safeParse(formdata);

    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      toast.error("All Field must be required!");
      setErrors(
        Object.fromEntries(
          Object.entries(formattedErrors).map(([key, value]) => [
            key,
            value?.[0] || "",
          ])
        )
      );
    } else {
      setErrors({});
      const promresp = await fetchapi(formdata);
      if (promresp.code === 201 || promresp.code === 200) {
        toast.success("Registration Successful");
        router.push("/loginstep");
      }
    }
  };

  useEffect(() => {
    setErrors({});
  }, [formdata]);

  return (
    <div className="bg-smoke-mmm lg:w-full py-4 lg:py-0 w-[100%] mx-auto lg:mt-4 mt-2">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col xl:flex-row justify-center items-start w-full gap-y-10 lg:gap-x-10 p-0 lg:p-24  bg-[url('/assets/images/login/imgpsh_fullsize_anim.png')]    ">
        <div>
          <JoinDetails />
        </div>
        {/* <div className="lg:min-w-[450px] lg:max-w-[450px] flex flex-col justify-center items-center gap-4">
          <div
            ref={props.ref}
            className="w-full bg-white rounded-xl shadow-xl md:p-6 p-4"
          >
            <div className="flex flex-col gap-6">
              <p className="text-red-500 text-md font-semibold">
                Free to Register! <br />
                No Credit Card Needed
              </p>

              <Select
                onValueChange={(value) =>
                  setFormData({ ...formdata, looking_for: value })
                }
              >
                <SelectTrigger className="w-full border-b-2 text-base hover:border-red-600 font-semibold rounded-none p-0 shadow-none focus:ring-0 focus:outline-none">
                  <SelectValue
                    className="text-base text-gray-500"
                    placeholder="Select your gender preference"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      value="I am a man looking for a woman"
                      className="text-base"
                    >
                      I am a man looking for a woman
                    </SelectItem>
                    <SelectItem
                      value="I am a man looking for a man"
                      className="text-base"
                    >
                      I am a man looking for a man
                    </SelectItem>
                    <SelectItem
                      value="I am a man looking for everyone"
                      className="text-base"
                    >
                      I am a man looking for everyone
                    </SelectItem>
                    <SelectItem
                      value="I am a woman looking for a woman"
                      className="text-base"
                    >
                      I am a woman looking for a woman
                    </SelectItem>
                    <SelectItem
                      value="I am a woman looking for a man"
                      className="text-base"
                    >
                      I am a woman looking for a man
                    </SelectItem>
                    <SelectItem
                      value="I am a woman looking for everyone"
                      className="text-base"
                    >
                      I am a woman looking for everyone
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.looking_for && (
                <p className="text-red-500">{errors.looking_for}</p>
              )}

              <div>
                <p className="text-base font-semibold ">Name:</p>
                <input
                  onChange={(e) =>
                    setFormData({ ...formdata, userName: e.target.value })
                  }
                  type="text"
                  placeholder="Enter Your name"
                  className="w-full placeholder:text-base py-2 border-b-2 text-base hover:border-red-600 font-semibold rounded-none p-0 shadow-none focus:ring-0 focus:outline-none"
                />
              </div>
              {errors.userName && (
                <p className="text-red-500">{errors.userName}</p>
              )}

              <DateSelector formdata={formdata} setFormData={setFormData} />

              <div>
                <p className="text-base font-semibold ">Email:</p>
                <input
                  onChange={(e) =>
                    setFormData({ ...formdata, email: e.target.value })
                  }
                  type="email"
                  placeholder="Enter Your Email"
                  className="w-full placeholder:text-base py-2 border-b-2 text-base hover:border-red-600 font-semibold rounded-none p-0 shadow-none focus:ring-0 focus:outline-none"
                />
              </div>
              {errors.email && <p className="text-red-500">{errors.email}</p>}

           
              <div>
                <p className="text-base font-semibold ">Phone Number:</p>
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={formdata.phoneNumber}
                  onChange={(value) =>
                    setFormData({ ...formdata, phoneNumber: value || "" })
                  }
                  className="w-full placeholder:text-base py-2 border-b-2 text-base hover:border-red-600 font-semibold rounded-none p-0 shadow-none focus:ring-0 focus:outline-none"
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500">{errors.phoneNumber}</p>
              )}

              <div>
                <p className="text-base font-semibold ">Password:</p>
                <input
                  onChange={(e) =>
                    setFormData({ ...formdata, password: e.target.value })
                  }
                  type="password"
                  placeholder="Enter Your Password"
                  className="w-full placeholder:text-base py-2 border-b-2 text-base hover:border-red-600 font-semibold rounded-none p-0 shadow-none focus:ring-0 focus:outline-none"
                />
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password}</p>
              )}

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formdata.isAggredTandC}
                  onChange={(e) =>
                    setFormData({
                      ...formdata,
                      isAggredTandC: e.target.checked,
                    })
                  }
                  className="w-10 h-10"
                />
                <p className="text-base">
                  I have read, understand and agree to{" "}
                  <Link
                    href="/legal-terms"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Use
                  </Link>
                  ,{" "}
                  <Link
                    href="/privacyinfo"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </Link>
                  ,{" "}
                  <Link
                    href="/legal-terms/paymentandrefund"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Payment and Refund Policy
                  </Link>
                  ,{" "}
                  <Link
                    href="/legal-terms#misconduct-prevention-policy"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Misconduct Prevention Policy
                  </Link>
                  .
                </p>
              </div>
              {errors.isAggredTandC && (
                <p className="text-red-500">{errors.isAggredTandC}</p>
              )}

              <button
                onClick={submit}
                className="text-xl w-full py-3 bg-gradient-to-r from-[#F05A8E] to-[#ED1C24] text-white font-semibold text-center rounded-md"
              >
                Register
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-xl">
            <p className="text-xs text-center">
              You affirm that you are at least 18 years of age or the age of
              majority in the jurisdiction you are accessing Match Meet & Marry
              from, and are fully able and competent to enter Match Meet & Marry
              and comply with the Match Meet & Marry Terms of Use & Service.
            </p>
          </div>
        </div> */}

        <div>
          <div className="md:p-6 flex flex-col md:gap-10 gap-2 md:px-0 px-4 md:mt-0 mt-4 ">
            <div className="flex items-center gap-2 text-red-500">
              <GoDotFill className="text-3xl" />
              <p className="text-2xl font-semibold ">About Us</p>
            </div>
            <p className=" text-[18px] text-white">
              Match Meet & Marry is a premium site with an impressive history of
              bringing people from different backgrounds together to communicate
              with each other.
            </p>
            <p className=" text-[18px] text-white">
              {`   Here at Match Meet & Marry, we believe that you shouldn't be limited in
                        opportunities to build a social connection with someone. On the
                        contrary, with the possibilities of the Internet, you should be
                        able to spark some exciting conversations that can lead to
                        learning fun and unexpected things.`}
            </p>
            <p className="text-[18px] text-white">
              Find people who share your values and goals and take in the
              pleasure of a great conversation.
            </p>
          </div>
          {/* heart icon for bliking  */}
          <div className="lg:flex hidden gap-8 items-center justify-center lg:mt-8 mt-2 flex-wrap   ">
            {["text-red-500"].map((color, index) => (
              <motion.div
                key={index}
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
                transition={{
                  duration: 1 + index * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`drop-shadow-lg ${color}`}
              >
                <Heart
                  fill="currentColor"
                  className="w-[150px] h-[150px]  md:w-[250px] md:h-[250px]"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingForm;
