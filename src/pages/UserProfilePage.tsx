import ProfileHeader from "../components/profile/ProfileHeader";
import SectionCard from "../components/profile/SectionCard";

const UserProfilePage = () => {
  return (
    <div className="p-6 h-fit">
      <ProfileHeader />
      <div className="mt-6 space-y-6">
        <SectionCard section="personal" />
        <SectionCard section="company" />
      </div>
    </div>
  );
};

export default UserProfilePage;
