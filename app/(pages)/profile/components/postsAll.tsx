"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { User } from "../type/type";
import CarouselViewDetails from "./imageCarousel";

const PublishedPostComponent = ({
  fetch,
  setChangeMade,
  changeMade,
}: {
  fetch: User;
  setChangeMade: React.Dispatch<React.SetStateAction<boolean>>;
  changeMade: boolean;
}) => {
  const t = useTranslations("profileComponents");

  return (
    <div className="max-w-3xl mx-auto">
      {fetch.posts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-soft-rose text-maroon px-3 py-1 rounded-full text-sm font-medium">
              {t("publishedBadge")}
            </div>
          </div>
          <CarouselViewDetails
            changeMade={changeMade}
            setChangeMade={setChangeMade}
            fetch={fetch}
            posts={fetch.posts}
          />
        </div>
      )}
    </div>
  );
};

export default PublishedPostComponent;
