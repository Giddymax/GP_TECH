import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type LeadNotificationEmailProps = {
  name: string;
  phone: string;
  email?: string;
  organisationType: string;
  serviceInterest: string;
  message?: string;
};

export function LeadNotificationEmail({
  name,
  phone,
  email,
  organisationType,
  serviceInterest,
  message,
}: LeadNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New lead from the Grainy Palace Tech website — {name}</Preview>
      <Body style={{ backgroundColor: "#f6f9fa", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ padding: "32px 24px", maxWidth: 480 }}>
          <Heading style={{ color: "#13242e", fontSize: 20 }}>New website lead</Heading>
          <Text style={{ color: "#56707a" }}>
            Someone requested help through grainypalacetech.com. Reply on WhatsApp or
            call within one working day.
          </Text>
          <Hr style={{ borderColor: "#dee8ea" }} />
          <Section>
            <Text style={{ margin: "4px 0" }}>
              <strong>Name:</strong> {name}
            </Text>
            <Text style={{ margin: "4px 0" }}>
              <strong>Phone:</strong> {phone}
            </Text>
            {email ? (
              <Text style={{ margin: "4px 0" }}>
                <strong>Email:</strong> {email}
              </Text>
            ) : null}
            <Text style={{ margin: "4px 0" }}>
              <strong>Organisation type:</strong> {organisationType}
            </Text>
            <Text style={{ margin: "4px 0" }}>
              <strong>Interested in:</strong> {serviceInterest}
            </Text>
            {message ? (
              <Text style={{ margin: "4px 0" }}>
                <strong>Message:</strong> {message}
              </Text>
            ) : null}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default LeadNotificationEmail;
