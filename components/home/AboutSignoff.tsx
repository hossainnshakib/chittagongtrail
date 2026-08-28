import { Container, Button } from "@/components/ui";

export function AboutSignoff() {
  return (
    <section className="section bg-dark-bg">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="font-display text-2xl md:text-3xl text-dark-text mb-8 leading-relaxed">
            &ldquo;Every trail I walk leads me deeper into understanding this
            incredible city. Chittagong isn&apos;t just a place I visit — it&apos;s a
            place that keeps revealing itself to me.&rdquo;
          </blockquote>
          <p className="text-dark-text/70 mb-8">
            This journal exists because I believe Chittagong deserves to be
            documented with care, honesty, and genuine appreciation for what
            makes it special.
          </p>
          <Button href="/about" variant="secondary">
            Read More
          </Button>
        </div>
      </Container>
    </section>
  );
}
