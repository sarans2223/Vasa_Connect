
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gem, CheckCircle, Crown, Leaf } from "lucide-react";

const membershipTiers = [
  {
    name: "Vasa Rise",
    tagline: "Every woman rising in life",
    price: "Free",
    priceSuffix: "",
    benefits: [
      "Access to job listings",
      "Create a professional profile",
      "Join community teams",
    ],
    buttonText: "Current Plan",
    variant: "secondary",
    icon: Leaf,
    iconClassName: "text-green-500",
    highlight: false,
  },
  {
    name: "Vasa Bloom",
    tagline: "Blooming into strength and skills",
    price: "₹99",
    priceSuffix: "/month",
    benefits: [
      "Everything in Vasa Rise, plus:",
      "Access to all learning modules",
      "Skill Tests & Basic Certification",
      "Priority Job Notifications",
      "'Blooming' profile badge",
    ],
    buttonText: "Upgrade to Bloom",
    variant: "default",
    highlight: true,
    icon: Gem,
    iconClassName: "text-blue-400",
  },
  {
    name: "Vasa Empower",
    tagline: "Highest empowerment + opportunities",
    price: "₹199",
    priceSuffix: "/month",
    benefits: [
      "Everything in Vasa Bloom, plus:",
      "Advanced Certifications",
      "Enhanced profile visibility to recruiters",
      "'Empowered' premium profile badge",
      "Direct mentorship opportunities",
    ],
    buttonText: "Upgrade to Empower",
    variant: "default",
    icon: Crown,
    iconClassName: "text-yellow-500",
    highlight: true,
  }
]

export default function MembershipPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-4">
            <Gem className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Unlock Your Potential</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Choose a plan that fits your journey. Her Dreams, Our Mission!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {membershipTiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <Card key={tier.name} className={`flex flex-col h-full ${tier.name === 'Vasa Bloom' ? 'shadow-2xl transform scale-105' : ''}`}>
              <CardHeader className="items-center text-center">
                 <Icon className={`h-12 w-12 mb-4 ${tier.name === 'Vasa Bloom' ? tier.iconClassName : tier.iconClassName || 'text-muted-foreground'}`} />
                <CardTitle className={`text-3xl font-extrabold ${tier.name === 'Vasa Rise' ? 'text-green-600' : ''} ${tier.name === 'Vasa Bloom' ? 'bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-500 to-cyan-400' : ''} ${tier.name === 'Vasa Empower' ? 'bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600' : ''}`}>
                    {tier.name}
                </CardTitle>
                <CardDescription className="text-base h-10">
                    {tier.tagline}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-8">
                  <div className="text-center">
                      <p className="text-5xl font-bold">{tier.price}<span className="text-lg font-normal text-muted-foreground">{tier.priceSuffix}</span></p>
                  </div>
                  <div className="space-y-4">
                      <ul className="space-y-3">
                          {tier.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start gap-3">
                                  <div className="flex-shrink-0 text-green-500 mt-1">
                                      <CheckCircle className="h-5 w-5" />
                                  </div>
                                  <span className="text-muted-foreground">{benefit}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
              </CardContent>
              <CardFooter>
                   <Button size="lg" className={`w-full text-lg h-12 shadow-lg ${tier.variant === 'default' ? 'bg-gradient-to-r from-[#E0BBE4] to-[#957DAD] hover:opacity-90 text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`} disabled={tier.variant === 'secondary'}>
                      {tier.buttonText}
                   </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
