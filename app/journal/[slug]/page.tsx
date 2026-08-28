import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PublicLayout } from "@/components/layout";
import { Container, Button } from "@/components/ui";

// Placeholder data - will be replaced with database queries
const placeholderStories: Record<string, { title: string; date: string; trail: string | null; trailSlug: string | null; content: string; image: string }> = {
  "winter-evening-at-patenga": {
    title: "Winter Evening at Patenga",
    date: "December 15, 2025",
    trail: "Patenga Beach",
    trailSlug: "patenga-beach",
    content: `
      <p>The sun sets over the Bay of Bengal, painting the sky in hues of orange and purple. I stand at the edge of the shore, watching the day end in spectacular fashion.</p>
      
      <p>Patenga Beach is different in winter. The crowds are thinner, the air is cooler, and there's a certain tranquility that summer simply cannot offer. This is when I prefer to visit — when the beach belongs to those who truly appreciate it.</p>
      
      <p>The fishing boats return as the light fades, their silhouettes creating perfect compositions against the colorful sky. I raise my camera, but then lower it again. Some moments are better experienced than captured.</p>
      
      <h2>The Walk Back</h2>
      
      <p>As I walk back along the shore, the first stars appear overhead. The sound of waves crashing becomes a gentle rhythm, a soundtrack to the ending day. Families pack up their picnic spots, couples stroll hand in hand, and children chase the last rays of sunlight.</p>
      
      <p>This is what Chittagong Trail is about — these quiet, beautiful moments that make this city so special. Not the tourist attractions or the famous landmarks, but the everyday magic that happens when you take the time to look.</p>
    `,
    image: "/images/placeholder-journal.jpg",
  },
  "walking-through-old-chittagong": {
    title: "Walking Through Old Chittagong",
    date: "November 28, 2025",
    trail: "Old Chittagong",
    trailSlug: "old-chittagong",
    content: `
      <p>Every street in the old quarter tells a story of centuries past. The colonial architecture, the narrow lanes, the ancient temples — all whispering tales of history that few take the time to listen to.</p>
      
      <p>I started my walk at the old railway station, a beautiful relic of the British era. The building stands as a reminder of a time when Chittagong was a vital port city, connecting East Bengal to the rest of the world.</p>
      
      <h2>The Temples</h2>
      
      <p>As I ventured deeper into the old quarter, I discovered several ancient temples tucked away between modern buildings. These sacred spaces have survived earthquakes, floods, and the passage of time. They stand as testaments to the spiritual heritage of Chittagong.</p>
      
      <p>The most striking was a small Hindu temple with intricate terracotta work. The artisans who created these decorations centuries ago could never have imagined that their work would still be admired today.</p>
      
      <h2>The People</h2>
      
      <p>What makes Old Chittagong truly special is its people. Shopkeepers who have run their businesses for generations, families who have lived in the same houses for centuries, and artisans who continue traditional crafts that are slowly disappearing from the modern world.</p>
    `,
    image: "/images/placeholder-journal.jpg",
  },
  "morning-at-foys-lake": {
    title: "Morning at Foy's Lake",
    date: "November 10, 2025",
    trail: "Foy's Lake",
    trailSlug: "foys-lake",
    content: `
      <p>The quiet hours before the city awakens, when the lake belongs to the birds and the mist hangs low over the water. This is my favorite time at Foy's Lake.</p>
      
      <p>I arrived before sunrise, when the air was still cool and the world was still asleep. The lake was like a mirror, reflecting the surrounding hills and the pale sky above. It was impossible to tell where the water ended and the sky began.</p>
      
      <h2>The Birds</h2>
      
      <p>Foy's Lake is a haven for birdwatchers. In the early morning, you can see kingfishers darting across the water, herons standing motionless in the shallows, and egrets gliding gracefully over the surface. Each species has its own rhythm, its own way of starting the day.</p>
      
      <p>I sat on a bench near the water's edge, watching the birds go about their morning routines. There was no rush, no urgency — just the quiet beauty of nature in the heart of the city.</p>
      
      <h2>The Mist</h2>
      
      <p>As the sun rose higher, the mist began to lift, revealing the lake in all its glory. The water turned from gray to blue, the hills became greener, and the world came alive with color. It was like watching a painting being created before my eyes.</p>
    `,
    image: "/images/placeholder-journal.jpg",
  },
  "the-art-of-mezbani": {
    title: "The Art of Mezbani",
    date: "October 20, 2025",
    trail: null,
    trailSlug: null,
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
    trail: null,
    trailSlug: null,
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
};

interface JournalPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: JournalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = placeholderStories[slug];

  if (!story) {
    return { title: "Story Not Found" };
  }

  return {
    title: story.title,
    description: story.content.replace(/<[^>]*>/g, "").substring(0, 160),
  };
}

export default async function JournalDetailPage({ params }: JournalPageProps) {
  const { slug } = await params;
  const story = placeholderStories[slug];

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
            {story.trail && (
              <>
                <span className="text-dark-text/50">·</span>
                <Link
                  href={`/trails/${story.trailSlug}`}
                  className="text-dark-accent text-sm hover:text-dark-text transition-colors"
                >
                  {story.trail}
                </Link>
              </>
            )}
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
            <Button href="/journal" variant="secondary">
              ← All Stories
            </Button>
            {story.trailSlug && (
              <Button href={`/trails/${story.trailSlug}`} variant="secondary">
                View Trail →
              </Button>
            )}
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
