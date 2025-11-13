import { TabsContent } from "@/components/ui/tabs";
import { Header } from "./Header";
import { TabNavigation } from "./TabNavigation";
import { TabContent } from "./TabContent";
import { DetailsSection } from "./DetailsSection";

export default function ProductDetailsPage() {
  return (
    <div className="w-full md:max-w-4xl mx-auto p-6 bg-gradient-to-b from-white to-gray-50 h-auto md:min-h-screen">
      <Header />

      <TabNavigation>
        <TabsContent value="details" className="space-y-4">
          <DetailsSection />
        </TabsContent>

        <TabContent
          value="packaging"
          title="Packaging Information"
          description="Premium eco-friendly packaging with protective padding. Comes in a beautiful decorative box perfect for gifting. Includes care instructions and authenticity certificate."
        />

        <TabContent
          value="shipping"
          title="Shipping Details"
          description="Ships within 2-3 business days. Free shipping on orders over $50. Standard delivery: 5-7 business days. Express shipping available. All items tracked with insurance coverage."
        />
      </TabNavigation>
    </div>
  );
}
