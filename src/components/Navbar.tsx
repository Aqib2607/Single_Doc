import { useState } from "react";
import { Menu, X, Phone, Mail, ShoppingCart, User, Settings, LogOut, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user, logout, isLoading } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/"
            className="text-2xl font-display font-bold text-gradient transition-smooth hover:scale-105"
          >
            Dr. Sarah Mitchell
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`transition-smooth ${isActive('/') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className={`transition-smooth ${isActive('/services') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className={`transition-smooth ${isActive('/about') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
            >
              About
            </Link>
            <Link 
              to="/blog" 
              className={`transition-smooth ${isActive('/blog') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
            >
              Blog
            </Link>
            <Link 
              to="/gallery" 
              className={`transition-smooth ${isActive('/gallery') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
            >
              Gallery
            </Link>
            <Link 
              to="/medicine-tests" 
              className={`transition-smooth ${isActive('/medicine-tests') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
            >
              Shop
            </Link>
            <Link to="/cart" className="relative">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link to="/appointment">
              <Button className="gradient-primary shadow-elegant hover:shadow-glow">
                Book Appointment
              </Button>
            </Link>
            {!isLoading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={user?.role === 'patient' ? '/patient-dashboard' : '/doctor-dashboard'} className="cursor-pointer flex items-center">
                      <User size={16} className="mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center">
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/appointment" className="cursor-pointer flex items-center">
                      <Calendar size={16} className="mr-2" />
                      Book Appointment
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/medicine-tests" className="cursor-pointer flex items-center">
                      <ShoppingCart size={16} className="mr-2" />
                      Shop
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer flex items-center">
                      <Settings size={16} className="mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/contact" className="cursor-pointer flex items-center">
                      <Phone size={16} className="mr-2" />
                      Contact Support
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !isLoading ? (
              <Link to="/login">
                <Button variant="secondary">Login</Button>
              </Link>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-smooth"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 animate-fade-in-up">
            <div className="flex flex-col gap-4">
              <Link 
                to="/" 
                onClick={() => setIsOpen(false)}
                className={`text-left px-4 py-2 rounded-lg transition-smooth ${isActive('/') ? 'text-primary bg-muted font-semibold' : 'text-foreground hover:text-primary hover:bg-muted'}`}
              >
                Home
              </Link>
              <Link 
                to="/services" 
                onClick={() => setIsOpen(false)}
                className={`text-left px-4 py-2 rounded-lg transition-smooth ${isActive('/services') ? 'text-primary bg-muted font-semibold' : 'text-foreground hover:text-primary hover:bg-muted'}`}
              >
                Services
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsOpen(false)}
                className={`text-left px-4 py-2 rounded-lg transition-smooth ${isActive('/about') ? 'text-primary bg-muted font-semibold' : 'text-foreground hover:text-primary hover:bg-muted'}`}
              >
                About
              </Link>
              <Link 
                to="/blog" 
                onClick={() => setIsOpen(false)}
                className={`text-left px-4 py-2 rounded-lg transition-smooth ${isActive('/blog') ? 'text-primary bg-muted font-semibold' : 'text-foreground hover:text-primary hover:bg-muted'}`}
              >
                Blog
              </Link>
              <Link 
                to="/gallery" 
                onClick={() => setIsOpen(false)}
                className={`text-left px-4 py-2 rounded-lg transition-smooth ${isActive('/gallery') ? 'text-primary bg-muted font-semibold' : 'text-foreground hover:text-primary hover:bg-muted'}`}
              >
                Gallery
              </Link>
              <Link 
                to="/medicine-tests" 
                onClick={() => setIsOpen(false)}
                className={`text-left px-4 py-2 rounded-lg transition-smooth ${isActive('/medicine-tests') ? 'text-primary bg-muted font-semibold' : 'text-foreground hover:text-primary hover:bg-muted'}`}
              >
                Shop
              </Link>
              <Link 
                to="/cart" 
                onClick={() => setIsOpen(false)}
                className="text-left px-4 py-2 rounded-lg transition-smooth text-foreground hover:text-primary hover:bg-muted flex items-center justify-between"
              >
                <span>Cart</span>
                {totalItems > 0 && (
                  <Badge className="ml-2">{totalItems}</Badge>
                )}
              </Link>
              <Link to="/appointment" onClick={() => setIsOpen(false)}>
                <Button className="gradient-primary shadow-elegant mx-4 w-[calc(100%-2rem)]">
                  Book Appointment
                </Button>
              </Link>
              {!isLoading && user ? (
                <>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsOpen(false)}
                    className="text-left px-4 py-2 rounded-lg transition-smooth text-foreground hover:text-primary hover:bg-muted flex items-center gap-2"
                  >
                    <User size={16} />
                    Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    onClick={() => setIsOpen(false)}
                    className="text-left px-4 py-2 rounded-lg transition-smooth text-foreground hover:text-primary hover:bg-muted flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-left px-4 py-2 rounded-lg transition-smooth text-destructive hover:bg-muted flex items-center gap-2 w-full"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : !isLoading ? (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="secondary" className="mx-4 w-[calc(100%-2rem)]">
                    Login
                  </Button>
                </Link>
              ) : null}
              <div className="px-4 py-2 space-y-2 border-t border-border mt-2">
                <a href="tel:+1234567890" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth">
                  <Phone size={16} />
                  <span>+1 (234) 567-890</span>
                </a>
                <a href="mailto:contact@drsarahmitchell.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth">
                  <Mail size={16} />
                  <span>contact@drsarahmitchell.com</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
