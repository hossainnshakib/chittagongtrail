import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicLayout } from "@/components/layout";
import { Container, Button } from "@/components/ui";

// Placeholder data - will be replaced with database queries
const placeholderFoodStories: Record<string, { title: string; date: string; content: string; image: string }> = {
  "the-art-of-mezbani": {
    title: "The Art of Mezbani",
    date: "October 20, 2025",
    content: `
      <p>A traditional Chittagong feast that brings families together. The preparation, the仪式, the flavors — everything about Mezbani is special.</p>
      
      <p>Mezbani is not just a meal; it's an experience. It's a celebration of Chittagong's culinary heritage, a time when families come together to share food, stories, and laughter.</p>
      
      <h2>The Preparation</h2>
      
      <p>The preparation for Mezbani begins days in advance. Women gather in the kitchen, chopping vegetables, grinding spices, and preparing the various dishes that will make up the feast. There's a rhythm to it, a choreography that has been perfected over generations.</p>
      
      <p>The men, meanwhile, handle the heavier tasks — setting up the eating area, preparing the fire, and ensuring everything is ready for the big day. It's a community effort, with everyone playing their part.</p>
      
      <h2>The Feast</h2>
      
      <p>When the food is finally served, it's a sight to behold. Large plates of rice, surrounded by bowls of different curries, pickles, and condiments. The aroma alone is enough to make your mouth water.</p>
      
      <p>But the best part isn't the food itself — it's the sharing. Everyone sits together, eating from the same plates, passing dishes to each other, and enjoying the simple pleasure of a meal shared with loved ones.</p>
    `,
    image: "/images/placeholder-food.jpg",
  },
  "street-food-adventures": {
    title: "Street Food Adventures",
    date: "October 5, 2025",
    content: `
      <p>Exploring the vibrant street food culture of Chittagong. From fuchka to chotpoti, every corner has something delicious to offer.</p>
      
      <p>Chittagong's street food scene is a world unto itself. It's a cacophony of sizzling pans, aromatic spices, and eager vendors competing for your attention. And in the middle of it all, some of the most delicious food you'll ever taste.</p>
      
      <h2>Fuchka</h2>
      
      <p>No exploration of Chittagong street food is complete without fuchka. These crispy hollow shells, filled with spiced potatoes and chickpeas, then dipped in tamarind water, are an obsession for locals and visitors alike.</p>
      
      <p>The best fuchka vendors are the ones who have been doing it for decades. They know exactly how to make the shells crispy, how to balance the spices, and how to create that perfect bite that keeps you coming back for more.</p>
      
      <h2>Chotpoti</h2>
      
      <p>Chotpoti is another Chittagong favorite — a spicy chickpea curry served with chopped onions, green chilies, and a squeeze of lime. It's simple, delicious, and utterly addictive.</p>
      
      <p>What makes Chittagong's chotpoti special is the variety of spices used. Each vendor has their own secret blend, their own way of creating that perfect balance of heat, tanginess, and depth.</p>
    `,
    image: "/images/placeholder-food.jpg",
  },
  "kala-bhuna-dark-delight": {
    title: "Kala Bhuna: A Dark Delight",
    date: "September 18, 2025",
    content: `
      <p>The rich, spicy flavors of Chittagong's signature beef curry. A dish that represents the bold culinary traditions of the region.</p>
      
      <p>Kala Bhuna is not for the faint of heart. It's a dish that demands attention, that commands respect, and that rewards those who dare to try it with an explosion of flavors.</p>
      
      <h2>The Preparation</h2>
      
      <p>What makes Kala Bhuna unique is its preparation. The beef is slow-cooked for hours, sometimes even overnight, until it becomes incredibly tender and absorbs all the spices and flavors.</p>
      
      <p>The "kala" in Kala Bhuna refers to the dark color of the dish, which comes from the caramelized onions and the long cooking process. It's not just about color — it's about depth of flavor.</p>
      
      <h2>The Experience</h2>
      
      <p>Eating Kala Bhuna is an experience in itself. The meat is so tender that it falls apart at the slightest touch. The spices are bold but not overwhelming, creating a perfect balance that keeps you coming back for more.</p>
      
      <p>Traditionally, Kala Bhuna is served with plain rice or paratha, allowing the flavors of the meat to shine through. It's a dish that speaks of tradition, of patience, and of the culinary artistry of Chittagong.</p>
    `,
    image: "/images/placeholder-food.jpg",
  },
  "the-shutki-experience": {
    title: "The Shutki Experience",
    date: "August 25, 2025",
    content: `
      <p>Dried fish, or shutki, is a staple in Chittagong cuisine. Love it or hate it, it's an essential part of the local food culture.</p>
      
      <p>For those unfamiliar with shutki, the smell can be overwhelming. But for those who grew up with it, it's the scent of home, of childhood memories, of family gatherings.</p>
      
      <h2>The varieties</h2>
      
      <p>There are many different types of shutki, each with its own flavor profile and culinary uses. Some are mild and subtle, others are intense and pungent. Each variety has its place in Chittagong's culinary repertoire.</p>
      
      <p>The most popular is loittya shutki, made from dried ribbon fish. It's versatile, flavorful, and can be prepared in countless ways — from simple stir-fries to complex curries.</p>
      
      <h2>The preparation</h2>
      
      <p>Preparing shutki is an art form. It requires understanding of how to balance the strong flavors with other ingredients, how to temper the intensity without losing the character, and how to create dishes that are both authentic and accessible.</p>
      
      <p>The best shutki dishes are those that respect the ingredient while making it approachable for those who might be trying it for the first time.</p>
    `,
    image: "/images/placeholder-food.jpg",
  },
};

interface FoodPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: FoodPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = placeholderFoodStories[slug];

  if (!story) {
    return { title: "Food Story Not Found" };
  }

  return {
    title: story.title,
    description: story.content.replace(/<[^>]*>/g, "").substring(0, 160),
  };
}

export default async function FoodDetailPage({ params }: FoodPageProps) {
  const { slug } = await params;
  const story = placeholderFoodStories[slug];

  if (!story) {
    notFound();
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent" />
        <Container className="relative z-10 pb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-dark-text/70 text-sm">{story.date}</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-dark-text">
            {story.title}
          </h1>
        </Container>
      </section>

      {/* Content */}
      <section className="section bg-background">
        <Container>
          <div className="max-w-3xl mx-auto">
            <article
              className="prose prose-lg prose-headings:font-display prose-headings:text-text prose-p:text-text-secondary prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: story.content }}
            />
          </div>
        </Container>
      </section>

      {/* Navigation */}
      <section className="section bg-background-secondary">
        <Container>
          <div className="flex justify-between items-center">
            <Button href="/food" variant="secondary">
              ← All Food Stories
            </Button>
            <Button href="/journal" variant="secondary">
              View Journal →
            </Button>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
