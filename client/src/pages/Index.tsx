import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckSquare, Sparkles, ArrowRight, Users, Shield, Zap } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: FileText,
      title: 'Smart Notes',
      description: 'Rich text editing with AI enhancement to improve your writing and organization.',
    },
    {
      icon: CheckSquare,
      title: 'Task Management',
      description: 'Create, organize, and track your todos with an intuitive interface.',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered',
      description: 'Enhance your notes with AI suggestions and improvements.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected with industry-standard security.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-subtle via-background to-accent/10">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Productivity Reimagined</span>
          </div>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-card-foreground leading-tight">
              Organize Your Life with{' '}
              <span className="gradient-primary bg-clip-text text-transparent">
                AI-Powered
              </span>{' '}
              Productivity
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your notes and tasks with intelligent features that help you think better, 
              organize smarter, and achieve more.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="gradient-primary text-white text-lg px-8 py-4 h-auto shadow-[var(--shadow-elegant)]"
            >
              <Link to="/signup" className="flex items-center space-x-2">
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 h-auto border-border hover:bg-card-hover"
            >
              <Link to="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="card-elegant text-center group hover:scale-105 transition-[var(--transition-spring)]">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-[var(--transition-spring)]">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="card-elegant bg-gradient-card border-primary/20">
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-card-foreground">
                Ready to boost your productivity?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join thousands of users who have transformed their workflow with our intelligent 
                productivity platform.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="gradient-primary text-white px-8 py-4 h-auto shadow-[var(--shadow-elegant)]"
              >
                <Link to="/signup" className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Create Account</span>
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 h-auto border-border hover:bg-card-hover"
              >
                <Link to="/login" className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Sign In Now</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
