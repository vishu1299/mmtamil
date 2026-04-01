import Image from 'next/image';
import React from 'react';
import { GoDotFill } from 'react-icons/go';
import { FaHeart } from 'react-icons/fa';

const JoinDetails = () => {
  const users = [
    { id: 1, src: "/assets/images/people/girl1.png", alt: "User 1", size: 150 },
    { id: 2, src: "/assets/images/people/girl2.png", alt: "User 2", size: 170 },
    { id: 3, src: "/assets/images/people/girl3.png", alt: "User 3", size: 200 },
    { id: 4, src: "/assets/images/people/girl4.png", alt: "User 4", size: 170 },
    { id: 5, src: "/assets/images/people/girl5.png", alt: "User 5", size: 150 },
  ];

  const userList = [
    { id: 1, src: "/assets/images/people/girl1.png", alt: "User 1", size: 160 },
    { id: 2, src: "/assets/images/people/girl2.png", alt: "User 2", size: 180 },
    { id: 3, src: "/assets/images/people/girl3.png", alt: "User 3", size: 170 },
    { id: 4, src: "/assets/images/people/girl4.png", alt: "User 4", size: 180 },
    { id: 5, src: "/assets/images/people/girl5.png", alt: "User 5", size: 150 },
    { id: 6, src: "/assets/images/people/girl6.png", alt: "User 6", size: 170 },
    { id: 7, src: "/assets/images/people/girl1.png", alt: "User 7", size: 160 },
    { id: 8, src: "/assets/images/people/girl2.png", alt: "User 8", size: 180 },
  ];

  const highlights = [
    "தாங்கள் விரும்பிய வரன்களின் விபரங்கள் மற்றும் ஜாதகங்களை Facebook page மற்றும் Website ல் இருந்து இலவசமாக பெறலாம்.",
    "கட்டணம் செலுத்தி பொருத்தமான Package ஒன்றை தெரிவு செய்வதன் மூலம் விரும்பிய வரன்களின் Photo வை website/ WhatsApp ல் கோரிப்பெறலாம்.",
    "மேலும் விரும்பிய வரன் வீட்டாரின் நேரடி தொடர்பை அவர்களின் சம்மதத்துடன் பெற்று மேலதிக விபரங்கள் தொடர்பில் நேரடியாகவே கலந்துரையாடலாம்.",
    "பொருத்துவதற்காகவோ அல்லது திருமணம் நிச்சயிக்கப்படும் தருணத்திலோ எந்தவித மேலதிக கட்டணங்களோ, தரகுப்பணமோ அறவிடப்பட மாட்டாது.",
  ];

  return (
    <div className="flex flex-col gap-6 w-full text-white">
      <div className="flex flex-col gap-4 px-4 md:px-2">
        <div className="flex items-center gap-2 text-red-500 md:mt-0 mt-4">
          <GoDotFill className="text-3xl" />
          <p className="text-2xl font-semibold">எங்களை பற்றி</p>
        </div>

        <p className="text-[18px] leading-relaxed">
          மாங்கல்யம், இலங்கையில் இயங்கிவரும் வெற்றிகரமான, விரைவான திருமண பந்தங்களை உருவாக்குவதில் வேகமாக வளர்ந்து வரும் முன்னணி திருமண சேவையாகும்.
        </p>

        <p className="text-[18px] leading-relaxed">
          மாங்கல்யம் முழுமையானதும் சரியானதுமான தகவல்களை வழங்க எத்தனிப்பதுடன் சிறந்த மற்றும் விரைவான சேவையையும் வரன்களிற்கு வழங்குகின்றது.
        </p>

        <p className="text-[18px] leading-relaxed">
          மாங்கல்யம் மூலம் வரன்கள் தங்களிற்கு பொருத்தமான அல்லது சிறந்த குடும்ப பின்னணி, சாதி, மதம், கல்வித்தகைமை மற்றும் தொழில் தகைமை உள்ள ஆத்ம துணையை உள்நாட்டிலேயோ அல்லது வெளிநாட்டில் புலம்பெயர்ந்து வாழ்கின்றவர்களையோ எமது இணையத்தளம் மற்றும் சமூக வலைத்தளம் மூலமாக தங்களுக்கு வழங்குகின்றது.
        </p>

        <p className="text-[18px] leading-relaxed">
          மாங்கல்யம் வலைத்தளப் பக்கம் ஊடாக online சேவையையும், மற்றும் WhatsApp, Facebook, Instagram போன்ற சமூக வலைத்தளங்கள் ஊடாகவும் தங்களிற்கு பொருத்தமான வரன்களை தெரிவு செய்ய உதவுகின்றது.
        </p>

        <p className="text-[18px] leading-relaxed">
          மேலும் தங்களால் பகிரப்படும் எந்தவொரு விபரங்களும் பாதுகாப்பாக பேணப்படும் என்பதையும் பொது வெளியில் பகிரப்படாது என்பதையும் உறுதிப்படுத்திக்கொள்கின்றது.
        </p>

        <p className="text-[18px] leading-relaxed">
          மிகக் கூடிய எண்ணிக்கையான வரன்களின் விபரங்களை தன்னகத்தே கொண்டிருப்பதனால் வரன்களின் திருப்தியான மற்றும் எதிர்பார்ப்பிற்குகந்த பொருத்தமான வரன்களை இணைப்பதில் மாங்கல்யம் சிறந்து விளங்குகின்றது.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {highlights.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <FaHeart className="text-[#EF4765] mt-1 flex-shrink-0" />
              <p className="text-[18px] leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center md:justify-start md:items-start lg:mt-8 mt-4 md:mt-0 lg:flex-nowrap flex-wrap">
        {users.map((user, index) => (
          <div
            key={user.id}
            style={{
              width: user.size,
              height: user.size,
              zIndex: index,
            }}
            className={`rounded-full border-4 border-orange-500 overflow-hidden -ml-4 first:ml-0 bg-white relative 
              w-[80px] h-[80px] sm:w-[70px] sm:h-[70px] md:w-[${user.size}px] md:h-[${user.size}px]`}
          >
            <Image
              src={user.src}
              alt={user.alt}
              width={user.size}
              height={user.size}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      <div className="w-full mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {userList.map((user, index) => (
            <div
              key={index}
              className="rounded-xl shadow-lg"
              style={{ height: `${user.size}px` }}
            >
              <Image
                src={user.src}
                alt={user.alt || `User Image ${index + 1}`}
                width={300}
                height={user.size}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JoinDetails;
