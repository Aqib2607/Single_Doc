import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - Dr. Sarah Mitchell</title>
          <meta name="description" content="Your shopping cart" />
        </Helmet>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="pt-32 pb-20">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto">
                <ShoppingBag size={64} className="mx-auto mb-6 text-muted-foreground" />
                <h1 className="text-4xl font-display font-bold text-gradient mb-4">
                  Your Cart is Empty
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Start adding medicines and tests to your cart
                </p>
                <Link to="/medicine-tests">
                  <Button className="gradient-primary">
                    Browse Medicine & Tests
                  </Button>
                </Link>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart - Dr. Sarah Mitchell</title>
        <meta name="description" content="Review your cart and proceed to checkout" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-8">
              Shopping Cart
            </h1>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{item.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.type === "medicine" ? "Medicine" : "Medical Test"}
                          </p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus size={16} />
                          </Button>
                          <span className="text-lg font-semibold w-12 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full"
                >
                  Clear Cart
                </Button>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery</span>
                      <span>$5.00</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span className="text-primary">${(totalPrice + 5).toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-3">
                    <Button className="w-full gradient-primary">
                      Proceed to Checkout
                    </Button>
                    <Link to="/medicine-tests" className="w-full">
                      <Button variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CartPage;
