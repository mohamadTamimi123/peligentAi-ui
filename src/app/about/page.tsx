/* eslint-disable react/no-unescaped-entities */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Users, Target, Award, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Agent UI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're passionate about building modern web applications that deliver exceptional user experiences. 
            Our team combines cutting-edge technology with thoughtful design to create solutions that matter.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                To empower developers and businesses with the tools and knowledge they need to build 
                world-class web applications. We believe that great software starts with great user experience.
              </p>
              <p className="text-lg text-gray-600">
                Our platform provides everything you need to go from idea to production, with a focus on 
                performance, scalability, and maintainability.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8">
              <div className="text-center">
                <Target className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Clear Vision
                </h3>
                <p className="text-gray-600">
                  We have a clear vision of what modern web development should be: fast, accessible, and delightful.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>User First</CardTitle>
                <CardDescription>
                  Every decision we make starts with the user experience. We build for people, not just technology.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Excellence</CardTitle>
                <CardDescription>
                  We strive for excellence in everything we do, from code quality to user interface design.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Passion</CardTitle>
                <CardDescription>
                  We're passionate about web development and creating tools that make a difference.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the talented people behind Agent UI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white text-2xl font-bold">JD</span>
                </div>
                <CardTitle>John Developer</CardTitle>
                <CardDescription>Lead Frontend Engineer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Passionate about React, Next.js, and creating beautiful user interfaces.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white text-2xl font-bold">SD</span>
                </div>
                <CardTitle>Sarah Designer</CardTitle>
                <CardDescription>UX/UI Designer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Creating intuitive and beautiful user experiences that users love.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white text-2xl font-bold">MB</span>
                </div>
                <CardTitle>Mike Backend</CardTitle>
                <CardDescription>Backend Engineer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Building robust and scalable backend systems that power our applications.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
