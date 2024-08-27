import prisma from "@/lib/prisma"; // Adjust the path to your Prisma instance

export async function createRenter(data) {
  const extraData = data.extraData;
  const bankAccounts = extraData?.bankAccounts || [];

  delete data.extraData;
  const newRenter = await prisma.client.create({
    data: {
      ...data,
      role: "RENTER",
    },
    include: {
      bankAccounts: true,
    },
  });
  if (bankAccounts.length > 0) {
    await prisma.bankAccount.createMany({
      data: bankAccounts.map((account) => ({
        accountNumber: account.accountNumber,
        accountName: account.accountName,
        bankName: account.bankName,
        bankId: account.bankId,
        clientId: newRenter.id,
      })),
    });
  }
  return newRenter;
}

export async function getRenters(page, limit) {
  const offset = (page - 1) * limit;
  const renters = await prisma.client.findMany({
    where: { role: "RENTER" },
    skip: offset,
    take: limit,
    include: {
      bankAccounts: true,
    },
  });
  const totalRenters = await prisma.client.count({ where: { role: "RENTER" } });
  const totalPages = Math.ceil(totalRenters / limit);

  return {
    data: renters,
    totalPages,
    total: totalRenters,
  };
}

export async function updateRenter(id, data) {
  const extraData = data.extraData;
  const bankAccounts = extraData?.bankAccounts || [];
  if (bankAccounts.length > 0) {
    bankAccounts.forEach((account) => {
      delete account.uniqueId;
    });
  }
  delete data.extraData;
  await prisma.bankAccount.deleteMany({
    where: {
      clientId: id,
    },
  });
  if (bankAccounts.length > 0) {
    await prisma.bankAccount.createMany({
      data: bankAccounts.map((account) => ({
        ...account,
        clientId: id,
      })),
    });
  }
  const updatedRenter = await prisma.client.update({
    where: { id },
    data: {
      ...data,
    },
    include: {
      bankAccounts: true,
    },
  });
  return updatedRenter;
}

export async function getRenterById(page, limit, searchParams, params) {
  const id = params.id;
  const renter = await prisma.client.findUnique({
    where: { id: +id },
    include: {
      bankAccounts: true,
    },
  });
  return renter;
}

export async function deleteRenter(id) {
  return await prisma.client.delete({
    where: { id },
  });
}

export async function createOwner(data) {
  const extraData = data.extraData;
  const bankAccounts = extraData?.bankAccounts || [];

  delete data.extraData;
  const newOwner = await prisma.client.create({
    data: {
      ...data,
      role: "OWNER",
    },
    include: {
      bankAccounts: true,
    },
  });
  if (bankAccounts.length > 0) {
    await prisma.bankAccount.createMany({
      data: bankAccounts.map((account) => ({
        accountNumber: account.accountNumber,
        accountName: account.accountName,
        bankName: account.bankName,
        bankId: account.bankId,
        clientId: newOwner.id,
      })),
    });
  }
  return newOwner;
}

export async function getOwners(page, limit) {
  const offset = (page - 1) * limit;
  const owners = await prisma.client.findMany({
    where: { role: "OWNER" },
    skip: offset,
    take: limit,
    include: {
      bankAccounts: true,
    },
  });
  const totalOwners = await prisma.client.count({ where: { role: "OWNER" } });
  const totalPages = Math.ceil(totalOwners / limit);

  return {
    data: owners,
    totalPages,
    total: totalOwners,
  };
}

export async function updateOwner(id, data) {
  const extraData = data.extraData;
  const bankAccounts = extraData?.bankAccounts || [];
  if (bankAccounts.length > 0) {
    bankAccounts.forEach((account) => {
      delete account.uniqueId;
    });
  }
  delete data.extraData;
  await prisma.bankAccount.deleteMany({
    where: {
      clientId: id,
    },
  });
  if (bankAccounts.length > 0) {
    await prisma.bankAccount.createMany({
      data: bankAccounts.map((account) => ({
        ...account,
        clientId: id,
      })),
    });
  }
  const updatedOwner = await prisma.client.update({
    where: { id },
    data: {
      ...data,
    },
    include: {
      bankAccounts: true,
    },
  });
  return updatedOwner;
}

export async function getOwnerById(page, limit, searchParams, params) {
  const id = params.id;
  const owner = await prisma.client.findUnique({
    where: { id: +id },
    include: {
      bankAccounts: true,
    },
  });
  return owner;
}

export async function deleteOwner(id) {
  return await prisma.client.delete({
    where: { id },
  });
}

export async function getClients() {
  const clients = await prisma.client.findMany();
  return {
    data: clients,
  };
}
