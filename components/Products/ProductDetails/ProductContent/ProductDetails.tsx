import { TabsContent } from "@/components/ui/tabs";
import { Header } from "./Header";
import { TabNavigation } from "./TabNavigation";
import { TabContent } from "./TabContent";
import { DetailsSection } from "./DetailsSection";

interface ProductDetailsPageProps {
  description?: string;
  additionalDescription?: string;
}

export default function ProductDetailsPage({ description, additionalDescription }: ProductDetailsPageProps) {
  return (
    <div className="w-full md:max-w-4xl mx-auto p-6 bg-gradient-to-b from-white to-gray-50 ">
      <Header />

      <TabNavigation>
        <TabsContent value="details" className="space-y-4">
          <DetailsSection description={description} additionalDescription={additionalDescription} />
        </TabsContent>

        <TabContent
          value="packaging"
          title="Packaging Information"
          description="Premium eco-friendly packaging with protective padding. Comes in a beautiful decorative box perfect for gifting. Includes care instructions and authenticity certificate."
        />

        <TabContent
          value="shipping"
          title="Shipping Details"
          description="We try our best to home deliver your goods in the shortest time possible. Our expert shipping partners Freedom Export has over 20 years of experience in cargo worldwide."
        />
      </TabNavigation>
    </div>
  );
}
