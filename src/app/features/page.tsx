import { Button } from '@/components/ui/Button'
import { Card, /* CardContent,*/ CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { ArrowRight, Zap, Shield, Users, Code, Rocket, Database, Globe, Lock, BarChart3, Smartphone, Palette } from 'lucide-react'

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for Modern Web Apps
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the comprehensive set of tools and capabilities that make our platform 
            the perfect choice for building next-generation web applications.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Core Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built on proven technologies with modern development practices
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Lightning Performance</CardTitle>
                <CardDescription>
                  Next.js 15 with React 19 delivers unmatched speed and performance optimization
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  Built-in security features and best practices for production applications
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>TypeScript First</CardTitle>
                <CardDescription>
                  Full type safety and enhanced developer experience from day one
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Instant Deployment</CardTitle>
                <CardDescription>
                  Deploy to production in minutes with our automated CI/CD pipeline
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Database Integration</CardTitle>
                <CardDescription>
                  Seamless integration with PostgreSQL, MongoDB, and other databases
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle>Global CDN</CardTitle>
                <CardDescription>
                  Content delivery network for lightning-fast loading worldwide
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Development Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Development Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tools and features that make development faster and more enjoyable
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Code className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Hot Reload</h3>
                  <p className="text-gray-600">
                    See your changes instantly with Next.js fast refresh and hot reload capabilities.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Built-in Analytics</h3>
                  <p className="text-gray-600">
                    Monitor performance and user behavior with integrated analytics and monitoring tools.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentication</h3>
                  <p className="text-gray-600">
                    Secure user authentication and authorization with multiple provider support.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Developer Tools</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>ESLint configuration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Prettier formatting</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>TypeScript strict mode</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Component library</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Utility functions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* UI/UX Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              User Experience Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Creating delightful experiences for your users
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Mobile First</CardTitle>
                <CardDescription>
                  Responsive design that works perfectly on all devices and screen sizes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Customizable Themes</CardTitle>
                <CardDescription>
                  Easy theming and customization options for your brand identity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Accessibility</CardTitle>
                <CardDescription>
                  WCAG compliant with keyboard navigation and screen reader support
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start building your next web application with our powerful platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="text-lg px-8">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600">
              View Documentation
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
