import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    IconArrowRight,
    IconMoped,
    IconQuote,
    IconShoppingBag,
    IconSparkles,
    IconToolsKitchen3,
} from "@tabler/icons-react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function Home() {
    return (
        <div className="bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <Image
                    src="https://images.unsplash.com/photo-1589010588553-46e8e7c21788?q=80&w=1260"
                    alt="A delicious dish with fresh ingredients, representing Platora's food and grocery services."
                    fill
                    priority
                    className="object-cover object-center transform scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                <div className="container relative mx-auto px-4 text-white z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 text-center lg:text-left">
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-lg">
                                Mangaluru&apos;s Flavors, <span className="text-primary-foreground">Delivered!</span>
                            </h1>
                            <p className="text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
                                Your favorite restaurants and groceries, delivered to your doorstep with lightning-fast speed.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Button asChild size="lg" className="px-8 py-6 text-lg">
                                    <Link href="/customer/restaurants">
                                        Order Now
                                        <IconArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Empty column for image on desktop, removed explicit image placeholder for more dynamic background */}
                        <div className="hidden lg:block"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-4xl font-bold text-center mb-12">Why Choose Platora?</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <Card
                        className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center bg-card">
                        <CardHeader className="flex flex-col items-center">
                            <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                                <IconShoppingBag className="h-10 w-10" />
                            </div>
                            <CardTitle className="text-2xl">Vast Selection</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Explore a wide range of local restaurants and grocery stores. Find exactly what you crave.
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center bg-card">
                        <CardHeader className="flex flex-col items-center">
                            <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                                <IconToolsKitchen3 className="h-10 w-10" />
                            </div>
                            <CardTitle className="text-2xl">Quality & Freshness</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                We partner with the best to ensure every meal and grocery item is fresh and delicious.
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center bg-card">
                        <CardHeader className="flex flex-col items-center">
                            <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                                <IconMoped className="h-10 w-10" />
                            </div>
                            <CardTitle className="text-2xl">Lightning Fast Delivery</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Our efficient delivery network gets your orders to you quickly and safely.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="container mx-auto px-4 py-16 bg-muted rounded-lg my-12">
                <h2 className="text-4xl font-bold text-center mb-12">How Platora Works</h2>
                <div className="grid md:grid-cols-3 gap-10 items-start text-center">
                    <div className="space-y-4">
                        <div
                            className="flex justify-center items-center p-4 rounded-full bg-secondary text-secondary-foreground mx-auto w-20 h-20 text-3xl font-bold">
                            1
                        </div>
                        <h3 className="text-xl font-semibold">Browse & Select</h3>
                        <p className="text-muted-foreground">
                            Explore diverse restaurants and shops in Mangaluru. Add your favorite items to the cart.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div
                            className="flex justify-center items-center p-4 rounded-full bg-secondary text-secondary-foreground mx-auto w-20 h-20 text-3xl font-bold">
                            2
                        </div>
                        <h3 className="text-xl font-semibold">Place Your Order</h3>
                        <p className="text-muted-foreground">
                            Securely checkout and pay. We&apos;ll handle the rest, from preparation to dispatch.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div
                            className="flex justify-center items-center p-4 rounded-full bg-secondary text-secondary-foreground mx-auto w-20 h-20 text-3xl font-bold">
                            3
                        </div>
                        <h3 className="text-xl font-semibold">Enjoy Your Delivery</h3>
                        <p className="text-muted-foreground">
                            Track your order in real-time and enjoy fresh groceries or hot meals at your doorstep.
                        </p>
                    </div>
                </div>
            </section>

            {/* Popular Picks (Updated with more visual appeal) */}
            <section className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-4xl font-bold mb-4">Our Trending Delights</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-10">
                    Discover the top-rated dishes and most sought-after groceries in Mangaluru. What are you craving today?
                </p>

                {/* Example: Image gallery of popular items */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="relative aspect-square rounded-lg overflow-hidden group">
                        <Image
                            src="https://images.unsplash.com/photo-1579737190013-43394a504d60?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Ghee Roast, a popular dish from Mangaluru."
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                            <p className="text-white font-semibold">Ghee Roast</p>
                        </div>
                    </div>
                    <div className="relative aspect-square rounded-lg overflow-hidden group">
                        <Image
                            src="https://images.unsplash.com/photo-1626078693895-ec63a436587c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Neer Dosa, a popular, traditional dish from Mangaluru."
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                            <p className="text-white font-semibold">Neer Dosa</p>
                        </div>
                    </div>
                    <div className="relative aspect-square rounded-lg overflow-hidden group">
                        <Image
                            src="https://images.unsplash.com/photo-1542838104-e25f899dd3a0?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Fresh produce and vegetables."
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                            <p className="text-white font-semibold">Fresh Produce</p>
                        </div>
                    </div>
                    <div className="relative aspect-square rounded-lg overflow-hidden group">
                        <Image
                            src="https://images.unsplash.com/photo-1582234329062-875f5698b64e?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="A variety of beverages, including sodas and juices."
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                            <p className="text-white font-semibold">Beverages</p>
                        </div>
                    </div>
                </div>

                <Button asChild size="lg" variant="secondary" className="px-8 py-6 text-lg">
                    <Link href="/customer/restaurants">Explore All Picks</Link>
                </Button>
            </section>

            {/* Testimonials Section */}
            <section className="bg-gradient-to-r from-primary to-purple-600 text-white py-16 sm:py-20">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-primary-foreground max-w-2xl mx-auto text-base sm:text-lg mb-10 sm:mb-12">
                        Hear from happy Platora users across Mangaluru!
                    </p>

                    <div className="relative">
                        <Carousel opts={{ align: "start" }} className="w-full max-w-4xl mx-auto">
                            <CarouselContent className="gap-6 sm:gap-8 px-1 sm:px-0">
                                {[...Array(8)].map((_, i) => (
                                    <CarouselItem key={i} className="flex-shrink-0 min-w-0 md:basis-1/2 lg:basis-1/3">
                                        <Card className="bg-white text-gray-800 p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow rounded-xl h-full flex flex-col justify-between">
                                            <div>
                                                <IconQuote className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-4" />
                                                <p className="italic text-sm sm:text-base mb-4">
                                                    &ldquo;Testimonial content goes here. This is a placeholder for customer feedback.&rdquo;
                                                </p>
                                            </div>
                                            <div className="text-right font-semibold text-sm sm:text-base">
                                                - Customer Name
                                            </div>
                                        </Card>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {/* Carousel Controls */}
                            <div className="absolute top-1/2 -translate-y-1/2 left-0 sm:-left-10 z-10">
                                <CarouselPrevious
                                    aria-label="Previous testimonial"
                                    className="bg-white text-primary hover:bg-primary hover:text-white transition-colors rounded-full p-2 shadow-md disabled:opacity-30"
                                />
                            </div>
                            <div className="absolute top-1/2 -translate-y-1/2 right-0 sm:-right-10 z-10">
                                <CarouselNext
                                    aria-label="Next testimonial"
                                    className="bg-white text-primary hover:bg-primary hover:text-white transition-colors rounded-full p-2 shadow-md disabled:opacity-30"
                                />
                            </div>
                        </Carousel>
                    </div>
                </div>
            </section>

            {/* Final Call to Action Section */}
            <section className="bg-background py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-screen-md mx-auto text-center">
                    <Card className="bg-card text-card-foreground shadow-xl rounded-2xl p-8 sm:p-10 border border-muted">
                        <CardHeader>
                            <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
                                Ready to Experience Platora?
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                                Join thousands of happy customers in Mangaluru enjoying fresh food and groceries delivered with a smile.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                                {/* Primary Action */}
                                <Button
                                    asChild
                                    size="lg"
                                    variant="default"
                                    className="rounded-full px-8 sm:px-10 py-5 sm:py-6 text-lg sm:text-xl font-semibold"
                                >
                                    <Link href="/customer/restaurants">
                                        Start Your Order
                                        <IconSparkles className="ml-3 h-5 w-5 sm:h-6 sm:w-6" />
                                    </Link>
                                </Button>

                                {/* Secondary Action */}
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="rounded-full px-8 sm:px-10 py-5 sm:py-6 text-lg sm:text-xl font-semibold"
                                >
                                    <Link href="/auth/signup">
                                        Become a Member
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>


        </div>
    );
}