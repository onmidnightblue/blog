import ContactContent from "@components/contact/ContactContent";
import PageShell from "@components/layout/PageShell";
import PageHeader from "@components/layout/PageHeader";

const page = () => {
  return (
    <PageShell>
      <PageHeader title="Contact" />
      <ContactContent />
    </PageShell>
  );
};

export default page;
