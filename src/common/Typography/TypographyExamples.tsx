"use client";

import {
  CaptionText,
  Heading1,
  Heading2,
  Heading3,
  LeadText,
  LinkText,
  Paragraph,
  SmallText,
  Typography,
} from "./Typography";

export default function TypographyExamples() {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <Heading1 className="!leading-normal">
        Typography System Examples
      </Heading1>
      <LeadText className="mt-4 mb-8">
        This page demonstrates the versatility of our typography system.
      </LeadText>

      {/* Basic variants */}
      <section className="mb-12">
        <Heading2 className="mb-6">Basic Variants</Heading2>
        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="h4">Heading 4</Typography>
        <Typography variant="h5">Heading 5</Typography>
        <Typography variant="h6">Heading 6</Typography>
        <Typography variant="body">Body text paragraph</Typography>
        <Typography variant="body-sm">Small body text</Typography>
        <Typography variant="body-xs">Extra small body text</Typography>
        <Typography variant="body-lg">Large body text</Typography>
      </section>

      {/* Display text */}
      <section className="mb-12">
        <Heading2 className="mb-6">Display Text</Heading2>
        <Typography variant="display">Display</Typography>
        <Typography variant="display-lg">Large Display</Typography>
      </section>

      {/* Special variants */}
      <section className="mb-12">
        <Heading2 className="mb-6">Special Variants</Heading2>
        <Typography variant="lead">
          Lead paragraph text for introductions
        </Typography>
        <Typography variant="caption">
          Caption text for images or side notes
        </Typography>
        <Typography variant="label">Form label text</Typography>
        <Typography variant="overline">Overline text</Typography>
        <Typography variant="code">Code: console.log("Hello world")</Typography>
        <Typography variant="link" href="#">
          Link text
        </Typography>
        <Typography variant="blockquote">
          This is a blockquote. Typography is not just about making words
          readable but making them worth reading in the first place.
        </Typography>
      </section>

      {/* Text weights */}
      <section className="mb-12">
        <Heading2 className="mb-6">Text Weights</Heading2>
        <Typography weight="thin">Thin text</Typography>
        <Typography weight="extralight">Extra light text</Typography>
        <Typography weight="light">Light text</Typography>
        <Typography weight="normal">Normal text</Typography>
        <Typography weight="medium">Medium text</Typography>
        <Typography weight="semibold">Semi-bold text</Typography>
        <Typography weight="bold">Bold text</Typography>
        <Typography weight="extrabold">Extra bold text</Typography>
        <Typography weight="black">Black text</Typography>
      </section>

      {/* Text alignments */}
      <section className="mb-12">
        <Heading2 className="mb-6">Text Alignments</Heading2>
        <Typography align="left" className="mb-2 border p-2">
          Left-aligned text
        </Typography>
        <Typography align="center" className="mb-2 border p-2">
          Center-aligned text
        </Typography>
        <Typography align="right" className="mb-2 border p-2">
          Right-aligned text
        </Typography>
      </section>

      {/* Text transforms */}
      <section className="mb-12">
        <Heading2 className="mb-6">Text Transforms</Heading2>
        <Typography transform="uppercase">Uppercase text</Typography>
        <Typography transform="lowercase">LOWERCASE TEXT</Typography>
        <Typography transform="capitalize">capitalize each word</Typography>
        <Typography transform="normal">Normal case text</Typography>
      </section>

      {/* Text decorations */}
      <section className="mb-12">
        <Heading2 className="mb-6">Text Decorations</Heading2>
        <Typography decoration="underline">Underlined text</Typography>
        <Typography decoration="line-through">Line-through text</Typography>
        <Typography decoration="no-underline">No underline</Typography>
      </section>

      {/* Truncation */}
      <section className="mb-12">
        <Heading2 className="mb-6">Text Truncation</Heading2>
        <Typography truncate={true} className="max-w-sm">
          This text will be truncated with an ellipsis if it exceeds the maximum
          width of the container because we've applied the truncate variant.
        </Typography>
        <div className="h-6"></div>
        <Typography truncate="multiline2" className="max-w-sm">
          This text will be truncated after two lines. Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus
          hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus
          rhoncus ut eleifend nibh porttitor.
        </Typography>
        <div className="h-6"></div>
        <Typography truncate="multiline3" className="max-w-sm">
          This text will be truncated after two lines. Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus
          hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus
          rhoncus ut eleifend nibh porttitor.
        </Typography>
      </section>

      {/* Color variations */}
      <section className="mb-12">
        <Heading2 className="mb-6">Color Variations</Heading2>
        <Typography color="default">Default text color</Typography>
        <Typography color="muted">Muted text color</Typography>
        <Typography color="subtle">Subtle text color</Typography>
        <Typography color="primary">Primary text color</Typography>
        <Typography color="secondary">Secondary text color</Typography>
        <Typography color="success">Success text color</Typography>
        <Typography color="warning">Warning text color</Typography>
        <Typography color="danger">Danger text color</Typography>
        <Typography color="info">Info text color</Typography>
        <div className="mt-2 bg-slate-900 p-4">
          <Typography color="white">
            White text color (on dark background)
          </Typography>
        </div>
      </section>

      {/* Combining variants */}
      <section className="mb-12">
        <Heading2 className="mb-6">Combining Variants</Heading2>
        <Typography
          variant="h3"
          weight="light"
          transform="uppercase"
          color="primary"
        >
          Combined styling example
        </Typography>
        <Typography
          variant="body"
          weight="medium"
          color="success"
          decoration="underline"
        >
          Another combined styling example
        </Typography>
      </section>

      {/* Custom component example */}
      <section className="mb-12">
        <Heading2 className="mb-6">Custom Element</Heading2>
        <Typography
          as="span"
          //   variant="code"
          className="text- inline-block bg-yellow-100 p-2"
        >
          This is a span with body text styling
        </Typography>
        <div className="h-4"></div>
        <Typography as="div" variant="h4" className="bg-blue-100 p-4">
          This is a div with h4 styling
        </Typography>
      </section>

      {/* Real-world example */}
      <section className="mb-12 rounded-lg border bg-white p-8">
        <Heading2 color="primary" className="mb-4">
          Product Features
        </Heading2>
        <LeadText className="mb-6">
          Our comprehensive typography system enhances your design workflow.
        </LeadText>

        <div className="space-y-4">
          <div>
            <Heading3 color="secondary" className="mb-2">
              Responsive by Default
            </Heading3>
            <Paragraph>
              All typography components are responsive and adapt to different
              screen sizes without additional configuration.
            </Paragraph>
          </div>

          <div>
            <Heading3 color="secondary" className="mb-2">
              Semantically Correct
            </Heading3>
            <Paragraph>
              Our system automatically maps variants to appropriate HTML
              elements for better accessibility and SEO.
            </Paragraph>
          </div>

          <div>
            <Heading3 color="secondary" className="mb-2">
              Highly Customizable
            </Heading3>
            <Paragraph>
              Combine variants, weights, colors, and transformations to create
              unique text styles that match your brand.
            </Paragraph>
            <SmallText color="muted" className="mt-2">
              The system also supports custom classes for edge cases.
            </SmallText>
          </div>
        </div>

        <div className="mt-8 rounded-md bg-slate-50 p-4">
          <CaptionText color="subtle" className="mb-2">
            Important Note
          </CaptionText>
          <SmallText>
            For more information about our typography system, please refer to
            the
            <LinkText href="#" className="mx-1">
              documentation
            </LinkText>
            or contact our design team.
          </SmallText>
        </div>
      </section>
    </div>
  );
}
