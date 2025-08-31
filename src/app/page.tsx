import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Users, 
  Code, 
  Rocket, 
  Sparkles,
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  Globe,
  Target,
  MessageSquare,
  Image,
  BarChart3,
  Bot,
  CreditCard,
  Clock,
  Star,
  DollarSign,
  Package,
  User,
  Calendar
} from 'lucide-react'

export default function Home() {
  const mainFeatures = [
    {
      icon: Sparkles,
      title: 'AI Product Intelligence',
      description: 'Automatically enhance product titles, descriptions, and SEO with AI-powered analysis and web research.',
      features: ['Bulk SEO optimization', 'Product enrichment', 'Auto-generated content'],
      example: {
        before: 'Wireless Headphones',
        after: 'Premium Noise-Cancelling Wireless Bluetooth Headphones with 30hr Battery Life',
        improvement: '+245% more descriptive'
      }
    },
    {
      icon: MessageSquare,
      title: 'Smart Chat Assistants',
      description: 'AI chatbots for customers and shop owners with real-time store data access.',
      features: ['Customer support chatbot', 'Admin assistant', 'Order management'],
      example: {
        customer: 'Customer: "Do you have wireless headphones?"',
        response: 'AI: "Yes! We have 3 models. The Premium Noise-Cancelling ($199) is our bestseller with 30hr battery. Would you like to see it?"',
        admin: 'Admin: "Show me customers who spent over $500"',
        result: 'AI: "Found 23 customers. Top spender: Sarah Johnson ($2,847 in 3 orders)"'
      }
    },
    {
      icon: Image,
      title: 'AI Media Tools',
      description: 'Automatically enhance your product images and create compelling visual content.',
      features: ['Background removal', 'AI-generated scenes', 'Auto image descriptions'],
      example: {
        before: 'Product on white background',
        after: 'Product in lifestyle setting with brand colors',
        features: ['Auto background removal', 'Generated lifestyle scenes', 'Optimized for mobile']
      }
    },
    {
      icon: BarChart3,
      title: 'Customer Analytics',
      description: 'Advanced customer insights, cohort forecasting, and behavioral analysis.',
      features: ['Customer segmentation', 'Purchase predictions', 'Behavioral insights'],
      example: {
        insights: [
          'Top 20% customers generate 80% of revenue',
          'Average customer lifetime value: $847',
          'Next purchase prediction: 85% accuracy'
        ]
      }
    }
  ]

  const processSteps = [
    {
      step: '01',
      title: 'Connect Your Store',
      description: 'Securely connect your WooCommerce store in just a few clicks.',
      icon: Globe,
      example: 'Connect in 2 minutes • 100% secure • No coding required'
    },
    {
      step: '02',
      title: 'AI Analyzes Everything',
      description: 'Our AI scans your products, customers, and store data to identify opportunities.',
      icon: Target,
      example: 'Analyzes 1,000+ products in minutes • Identifies SEO gaps • Finds optimization opportunities'
    },
    {
      step: '03',
      title: 'Generate & Optimize',
      description: 'Create compelling content, optimize SEO, and enhance product listings with AI.',
      icon: Sparkles,
      example: 'Generates 50+ product descriptions per hour • Improves SEO scores by 40% • Auto-categorizes products'
    },
    {
      step: '04',
      title: 'Scale & Automate',
      description: 'Bulk update products, automate workflows, and watch your sales grow.',
      icon: Zap,
      example: 'Bulk update 500+ products instantly • Automated workflows save 20hrs/week • 30% average sales increase'
    }
  ]

  const pricingTiers = [
    {
      name: 'Free',
      price: '$0',
      credits: '100',
      description: 'Perfect for trying out our features',
      popular: false,
      examples: ['5 product descriptions', 'Basic SEO analysis', 'Customer chat support']
    },
    {
      name: 'Starter',
      price: '$29',
      credits: '500',
      description: 'Great for small stores',
      popular: false,
      examples: ['25 product descriptions', 'Full SEO optimization', 'Basic analytics']
    },
    {
      name: 'Pro',
      price: '$99',
      credits: '2,000',
      description: 'Ideal for growing businesses',
      popular: true,
      examples: ['100+ product descriptions', 'Advanced AI models', 'Customer analytics']
    },
    {
      name: 'Enterprise',
      price: '$299',
      credits: '10,000',
      description: 'For large-scale operations',
      popular: false,
      examples: ['Unlimited AI features', 'Custom integrations', 'Dedicated support']
    }
  ]

  const customerExamples = [
    {
      name: 'TechGear Store',
      industry: 'Electronics',
      improvement: '+45% sales increase',
      testimonial: '"PELIGENT helped us optimize 500+ products in 2 days. Our SEO traffic doubled!"',
      avatar: 'TG'
    },
    {
      name: 'Fashion Forward',
      industry: 'Apparel',
      improvement: '+67% conversion rate',
      testimonial: '"The AI chat assistant handles 80% of customer inquiries. Game changer!"',
      avatar: 'FF'
    },
    {
      name: 'Home Essentials',
      industry: 'Home & Garden',
      improvement: '+38% average order value',
      testimonial: '"Customer analytics helped us identify our best customers. Revenue up 40%!"',
      avatar: 'HE'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                <Star className="h-4 w-4 mr-2" />
                AI-Powered WooCommerce Assistant
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your
                <span className="text-blue-600"> WooCommerce</span>
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                Store with AI
              </h1>
              <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto lg:mx-0 px-4 lg:px-0">
                The complete AI assistant for WooCommerce store owners. Generate product content, 
                optimize SEO, manage customers, and automate your entire store operations with 
                intelligent AI that understands your business.
              </p>
              <div className="mt-8 sm:mt-10 flex justify-center lg:justify-start px-4 lg:px-0">
                <Button size="lg" className="text-lg px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="mt-8 flex justify-center lg:justify-start items-center space-x-8 text-sm text-gray-600 px-4 lg:px-0">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  14-day free trial
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Cancel anytime
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                    <div className="text-white text-sm">PELIGENT Dashboard</div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="h-12 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">AI Chat</span>
                      </div>
                      <div className="h-12 bg-green-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Products</span>
                      </div>
                      <div className="h-12 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Analytics</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <div className="flex-1 h-8 bg-gray-700 rounded"></div>
                      <div className="flex-1 h-8 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI-Powered Dashboard
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">500+</div>
              <div className="text-sm text-gray-600">Products optimized</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">30%</div>
              <div className="text-sm text-gray-600">Average sales increase</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">20hrs</div>
              <div className="text-sm text-gray-600">Time saved per week</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">85%</div>
              <div className="text-sm text-gray-600">Customer satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Scale Your Store
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI-powered tools designed specifically for WooCommerce store owners
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base mb-4">
                    {feature.description}
                  </CardDescription>
                  <div className="space-y-2">
                    {feature.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feat}
                      </div>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes, not months
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-sm font-bold text-blue-600 mb-2">{step.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <div className="text-sm text-blue-600 font-medium">{step.example}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`text-center hover:shadow-lg transition-shadow duration-300 ${tier.popular ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader>
                  {tier.popular && (
                    <div className="bg-blue-600 text-white text-sm font-bold py-1 px-3 rounded-full mb-4">
                      Most Popular
                    </div>
                  )}
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{tier.price}</div>
                  <div className="text-sm text-gray-600 mb-4">{tier.credits} credits/month</div>
                  <CardDescription className="mb-6">{tier.description}</CardDescription>
                  <div className="space-y-2">
                    {tier.examples.map((example, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {example}
                      </div>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Store Owners Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how PELIGENT is transforming WooCommerce stores
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {customerExamples.map((customer, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold text-lg">{customer.avatar}</span>
                  </div>
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                  <div className="text-sm text-gray-600 mb-2">{customer.industry}</div>
                  <div className="text-green-600 font-bold mb-4">{customer.improvement}</div>
                  <CardDescription className="italic">"{customer.testimonial}"</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Store?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of store owners who are already using PELIGENT to scale their WooCommerce business
          </p>
          <Button variant="secondary" size="lg" className="text-lg px-8">
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <div className="mt-8 flex justify-center items-center space-x-8 text-sm text-blue-100">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              No setup fees
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Cancel anytime
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              24/7 support
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
