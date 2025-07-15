import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import EditProfilePhoto from "@/assets/icons/edit-profile-photo.svg?react";
import profileImage from "@/assets/images/image.png";
import { useTranslation } from "react-i18next";
const ProfileHeader = () => {
  const [t] = useTranslation("global");
  
  return (
    <div className="flex flex-col gap-4 pt-4 pb-2">
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold">{t("modules.profile.title")}</span>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <div className="relative">
          <Avatar className="w-[83px] h-[83px] border-2 border-primary">
            <AvatarImage src={profileImage} alt={t("modules.profile.title")} />
            <AvatarFallback>MI</AvatarFallback>
          </Avatar>
          {/* Edit overlay icon */}
          <EditProfilePhoto className="absolute bottom-0 right-0" />
        </div>
        <div>
          <div className="text-gray-500 text-sm">{t("modules.profile.greeting")}</div>
          <div className="text-[20px] font-semibold">Mohammad Imran</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
