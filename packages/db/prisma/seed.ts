import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a demo partner
  const partner = await prisma.partner.upsert({
    where: { slug: 'demo-msp' },
    update: {},
    create: {
      name: 'Demo MSP',
      slug: 'demo-msp',
      billingEmail: 'billing@demo-msp.com',
      status: 'ACTIVE',
    },
  });

  console.log(`✅ Created partner: ${partner.name}`);

  // Create a demo organization
  const organization = await prisma.organization.upsert({
    where: { partnerId_slug: { partnerId: partner.id, slug: 'acme-corp' } },
    update: {},
    create: {
      partnerId: partner.id,
      name: 'Acme Corp',
      slug: 'acme-corp',
      contactEmail: 'contact@acme-corp.com',
      status: 'ACTIVE',
    },
  });

  console.log(`✅ Created organization: ${organization.name}`);

  // Create a demo site
  const site = await prisma.site.create({
    data: {
      organizationId: organization.id,
      name: 'Main Office',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      zipCode: '94102',
      timezone: 'America/Los_Angeles',
    },
  });

  console.log(`✅ Created site: ${site.name}`);

  // Create platform admin role
  const platformAdminRole = await prisma.role.upsert({
    where: { name_scope: { name: 'Platform Admin', scope: 'PLATFORM' } },
    update: {},
    create: {
      name: 'Platform Admin',
      scope: 'PLATFORM',
      permissions: ['*'],
      description: 'Full platform access',
    },
  });

  console.log(`✅ Created role: ${platformAdminRole.name}`);

  console.log('✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
