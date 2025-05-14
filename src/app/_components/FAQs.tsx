import {
  AccordionContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export default function FAQSection() {
  return (
    <section id="faq" className="w-full bg-gray-200 py-24 md:py-32">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-xl font-bold text-black md:mb-16 md:text-2xl">
          Frequently Asked Questions
        </h2>
        <Accordion
          type="single"
          collapsible
          className="mx-auto w-full max-w-2xl"
        >
          <AccordionItem value="item-4" className="mb-4">
            <AccordionTrigger className="text-base font-semibold text-black md:text-lg">
              What can I use Codeshare for?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              You can use Codeshare for everything code sharing, like pair
              programming, sharing code online with your team, tech interviews,
              teaching... you name it.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5" className="mb-4">
            <AccordionTrigger className="text-base font-semibold text-black md:text-lg">
              How long does a file last?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              Forever (unless the creator of the file deletes it).
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7" className="mb-4">
            <AccordionTrigger className="text-base font-semibold text-black md:text-lg">
              How can I compile or run the code?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              You can&apos;t. Codeshare is not intended to run or compile code;
              it is just meant to share and edit code collaboratively.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-8" className="mb-4">
            <AccordionTrigger className="text-base font-semibold text-black md:text-lg">
              Can anyone see a file I created?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              Yes, as long as they have the file link. So, never put
              confidential information inside a file.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-9" className="mb-4">
            <AccordionTrigger className="text-base font-semibold text-black md:text-lg">
              Can I prevent a file from being modified by other people?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              Yes, just turn the &quot;view-only&quot; option on when you share
              the file or from your Dashboard. Keep in mind that this option can
              only be changed by the user who created the file.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
