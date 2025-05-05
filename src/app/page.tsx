import AnnouncementModal from "@/components/announcement-modal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HomeApp from "@/components/HomeApp";
import TabLayout from "@/components/TabLayout";

export default function Home() {
  return (
    <TabLayout>
      <Header />
      <HomeApp />
      <Footer />
      <AnnouncementModal />
    </TabLayout>
  );
}
