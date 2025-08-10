
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Github, ArrowRight, Zap, Shield, Smartphone, Monitor, Tablet } from 'lucide-react'
import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";

export default function Home() {
  return (
    <ThemeProvider>
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                Pistash
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="https://github.com/bikash1376" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-4">
              Modern API Testing
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Test APIs with{' '}
              <span className="text-primary">pistash</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A modern, minimal API testing dashboard that makes testing REST APIs simple and intuitive. 
              Built for developers who value clean design and powerful functionality.
            </p>
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link to="/">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">See pistash in Action</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch how easy it is to test your APIs with our intuitive interface
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
              <video 
                className="w-full h-full object-cover"
                autoPlay 
                muted 
                loop 
                playsInline
              >
                <source src="/placeholder-video.mp4" type="video/mp4" />
                {/* Fallback for browsers that don't support video */}
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-center">
                    <Monitor className="h-16 w-16 mx-auto mb-4 text-primary" />
                    <p className="text-lg text-muted-foreground">API Testing Dashboard Preview</p>
                  </div>
                </div>
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to test APIs efficiently and effectively
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Send requests instantly with our optimized interface. No delays, no waiting - just pure speed and efficiency.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Secure Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Test your APIs securely with support for various authentication methods and encrypted connections.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Mobile Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Fully responsive design that works perfectly on desktop, tablet, and mobile devices.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Beautiful on Every Device</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              pistash looks great and works seamlessly across all your devices
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 items-end">
            {/* Desktop Screenshot */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-700 p-2 rounded-t-lg">
                  <div className="flex space-x-1 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-background border-2 border-t-0 rounded-b-lg aspect-[16/10] flex items-center justify-center">
                  <Monitor className="h-16 w-16 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Desktop</h3>
              <p className="text-muted-foreground">Full-featured experience with sidebar and all tools visible</p>
            </div>

            {/* Tablet Screenshot */}
            <div className="text-center">
              <div className="relative mb-6 mx-auto max-w-sm">
                <div className="bg-slate-800 p-4 rounded-2xl">
                  <div className="bg-background rounded-lg aspect-[4/3] flex items-center justify-center">
                    <Tablet className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Tablet</h3>
              <p className="text-muted-foreground">Optimized layout with collapsible sidebar for better space usage</p>
            </div>

            {/* Mobile Screenshot */}
            <div className="text-center">
              <div className="relative mb-6 mx-auto max-w-xs">
                <div className="bg-slate-900 p-2 rounded-3xl">
                  <div className="bg-background rounded-2xl aspect-[9/16] flex items-center justify-center">
                    <Smartphone className="h-10 w-10 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Mobile</h3>
              <p className="text-muted-foreground">Touch-optimized interface with drawer navigation</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Got questions? We've got answers.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  What types of APIs can I test with pistash?
                </AccordionTrigger>
                <AccordionContent>
                  pistash supports testing REST APIs with all common HTTP methods (GET, POST, PUT, DELETE). 
                  You can test any publicly accessible API or your own private APIs with proper authentication.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  Is pistash free to use?
                </AccordionTrigger>
                <AccordionContent>
                  Yes! pistash is completely free and open-source. You can use it without any limitations, 
                  and even contribute to its development on GitHub.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  Can I save my API requests for later use?
                </AccordionTrigger>
                <AccordionContent>
                  pistash allows you to save your API requests with all their configurations 
                  (headers, body, method) so you can quickly reuse them later.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  Does pistash work on mobile devices?
                </AccordionTrigger>
                <AccordionContent>
                  Yes! pistash is fully responsive and works great on mobile devices and tablets. 
                  The interface adapts to smaller screens with a collapsible sidebar and touch-optimized controls.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  What authentication methods are supported?
                </AccordionTrigger>
                <AccordionContent>
                  pistash supports various authentication methods through custom headers. You can easily add 
                  Bearer tokens, API keys, basic authentication, and any other header-based authentication method.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link to="/" className="text-2xl font-bold text-primary mb-4 block">
                pistash
              </Link>
              <p className="text-muted-foreground mb-4 max-w-md">
                A modern, minimal API testing dashboard built for developers who value clean design and powerful functionality.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link to="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><Link to="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="#faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">API Reference</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 pistash. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </ThemeProvider>
  )
}
