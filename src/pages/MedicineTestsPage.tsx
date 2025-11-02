import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { Pill, TestTube, Search } from "lucide-react";

interface Medicine {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

interface Test {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

const MedicineTestsPage = () => {
  const { addToCart } = useCart();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [medicineCategories, setMedicineCategories] = useState<string[]>([]);
  const [testCategories, setTestCategories] = useState<string[]>([]);
  const [medicineSearch, setMedicineSearch] = useState("");
  const [testSearch, setTestSearch] = useState("");
  const [medicineCategory, setMedicineCategory] = useState("all");
  const [testCategory, setTestCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicines();
    fetchTests();
    fetchCategories();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/medicines');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMedicines(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      toast.error('Failed to load medicines');
      setMedicines([]);
    }
  };

  const fetchTests = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/tests');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error('Failed to load tests');
      setTests([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const [medicineRes, testRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/medicines/categories'),
        fetch('http://127.0.0.1:8000/api/tests/categories')
      ]);
      
      const medicineData = medicineRes.ok ? await medicineRes.json() : [];
      const testData = testRes.ok ? await testRes.json() : [];
      
      setMedicineCategories(Array.isArray(medicineData) ? medicineData : []);
      setTestCategories(Array.isArray(testData) ? testData : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      setMedicineCategories([]);
      setTestCategories([]);
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name?.toLowerCase().includes(medicineSearch.toLowerCase()) ||
                         medicine.description?.toLowerCase().includes(medicineSearch.toLowerCase());
    const matchesCategory = medicineCategory === "all" || medicine.category === medicineCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name?.toLowerCase().includes(testSearch.toLowerCase()) ||
                         test.description?.toLowerCase().includes(testSearch.toLowerCase());
    const matchesCategory = testCategory === "all" || test.category === testCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (item: Medicine | Test, type: "medicine" | "test") => {
    addToCart({
      id: item.id.toString(),
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

            {loading ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">Loading...</p>
              </div>
            ) : (
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
                          ${typeof medicine.price === 'number' ? medicine.price.toFixed(2) : parseFloat(medicine.price || '0').toFixed(2)}
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
                          ${typeof test.price === 'number' ? test.price.toFixed(2) : parseFloat(test.price || '0').toFixed(2)}
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
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MedicineTestsPage;
