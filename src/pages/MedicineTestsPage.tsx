import { useState } from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Pill, TestTube, Search } from "lucide-react";

const medicines = [
  {
    id: "med-1",
    name: "Aspirin 100mg",
    price: 5.99,
    description: "Pain relief and anti-inflammatory medication",
    category: "Pain Relief",
    inStock: true,
  },
  {
    id: "med-2",
    name: "Vitamin D3",
    price: 12.99,
    description: "Essential vitamin supplement for bone health",
    category: "Vitamins",
    inStock: true,
  },
  {
    id: "med-3",
    name: "Amoxicillin 500mg",
    price: 15.99,
    description: "Antibiotic for bacterial infections",
    category: "Antibiotics",
    inStock: true,
  },
  {
    id: "med-4",
    name: "Ibuprofen 400mg",
    price: 7.99,
    description: "Pain and fever reducer",
    category: "Pain Relief",
    inStock: true,
  },
  {
    id: "med-5",
    name: "Omeprazole 20mg",
    price: 18.99,
    description: "Reduces stomach acid production",
    category: "Digestive",
    inStock: false,
  },
  {
    id: "med-6",
    name: "Metformin 850mg",
    price: 22.99,
    description: "Diabetes management medication",
    category: "Diabetes",
    inStock: true,
  },
];

const tests = [
  {
    id: "test-1",
    name: "Complete Blood Count",
    price: 35.00,
    description: "Comprehensive blood analysis including RBC, WBC, platelets",
    category: "Blood Tests",
    inStock: true,
  },
  {
    id: "test-2",
    name: "Lipid Profile",
    price: 45.00,
    description: "Cholesterol and triglycerides screening",
    category: "Heart Health",
    inStock: true,
  },
  {
    id: "test-3",
    name: "Thyroid Function Test",
    price: 55.00,
    description: "TSH, T3, T4 hormone levels",
    category: "Hormone Tests",
    inStock: true,
  },
  {
    id: "test-4",
    name: "Liver Function Test",
    price: 42.00,
    description: "Assess liver health and enzyme levels",
    category: "Organ Function",
    inStock: true,
  },
  {
    id: "test-5",
    name: "Vitamin D Test",
    price: 38.00,
    description: "Measure vitamin D levels in blood",
    category: "Vitamin Tests",
    inStock: true,
  },
  {
    id: "test-6",
    name: "HbA1c Test",
    price: 32.00,
    description: "Blood sugar control over past 3 months",
    category: "Diabetes Tests",
    inStock: false,
  },
];

const MedicineTestsPage = () => {
  const { addToCart } = useCart();
  const [medicineSearch, setMedicineSearch] = useState("");
  const [testSearch, setTestSearch] = useState("");
  const [medicineCategory, setMedicineCategory] = useState("all");
  const [testCategory, setTestCategory] = useState("all");

  const medicineCategories = [...new Set(medicines.map(m => m.category))];
  const testCategories = [...new Set(tests.map(t => t.category))];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(medicineSearch.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(medicineSearch.toLowerCase());
    const matchesCategory = medicineCategory === "all" || medicine.category === medicineCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(testSearch.toLowerCase()) ||
                         test.description.toLowerCase().includes(testSearch.toLowerCase());
    const matchesCategory = testCategory === "all" || test.category === testCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (item: any, type: "medicine" | "test") => {
    addToCart({
      id: item.id,
      name: item.name,
      type,
      price: item.price,
      description: item.description,
    });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <>
      <Helmet>
        <title>Medicine & Tests - Dr. Sarah Mitchell</title>
        <meta name="description" content="Browse and order medicines and medical tests online" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
                Medicine & Tests
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Order medications and book medical tests from the comfort of your home
              </p>
            </div>

            <Tabs defaultValue="medicine" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="medicine" className="flex items-center gap-2">
                  <Pill size={18} />
                  Medicine
                </TabsTrigger>
                <TabsTrigger value="tests" className="flex items-center gap-2">
                  <TestTube size={18} />
                  Tests
                </TabsTrigger>
              </TabsList>

              <TabsContent value="medicine" className="animate-fade-in">
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      placeholder="Search medicines..."
                      value={medicineSearch}
                      onChange={(e) => setMedicineSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={medicineCategory} onValueChange={setMedicineCategory}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {medicineCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMedicines.map((medicine) => (
                    <Card key={medicine.id} className="hover:shadow-elegant transition-smooth">
                      <CardHeader>
                        <CardTitle>{medicine.name}</CardTitle>
                        <CardDescription>{medicine.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-primary">
                          ${medicine.price.toFixed(2)}
                        </p>
                        {!medicine.inStock && (
                          <p className="text-sm text-destructive mt-2">Out of stock</p>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => handleAddToCart(medicine, "medicine")}
                          disabled={!medicine.inStock}
                          className="w-full gradient-primary"
                        >
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tests" className="animate-fade-in">
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      placeholder="Search tests..."
                      value={testSearch}
                      onChange={(e) => setTestSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={testCategory} onValueChange={setTestCategory}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {testCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTests.map((test) => (
                    <Card key={test.id} className="hover:shadow-elegant transition-smooth">
                      <CardHeader>
                        <CardTitle>{test.name}</CardTitle>
                        <CardDescription>{test.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-primary">
                          ${test.price.toFixed(2)}
                        </p>
                        {!test.inStock && (
                          <p className="text-sm text-destructive mt-2">Currently unavailable</p>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => handleAddToCart(test, "test")}
                          disabled={!test.inStock}
                          className="w-full gradient-primary"
                        >
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MedicineTestsPage;
