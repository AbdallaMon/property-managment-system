import prisma from "@/lib/prisma";

export async function createUnit(data) {
  const createData = {
    number: data.number,
    yearlyRentPrice: +data.yearlyRentPrice,
    electricityMeter: data.electricityMeter,
    numBedrooms: +data.numBedrooms,
    floor: +data.floor,
    numBathrooms: +data.numBathrooms,
    numACs: +data.numACs,
    numLivingRooms: +data.numLivingRooms,
    numKitchens: +data.numKitchens,
    numSaloons: +data.numSaloons,
    unitId: data.unitId,
    notes: data.notes,
    type: {
      connect: {
        id: +data.typeId,
      },
    },
    property: {
      connect: {
        id: +data.propertyId,
      },
    },
  };

  const newUnit = await prisma.unit.create({
    data: createData,
    include: {
      type: {
        select: {
          id: true,
          name: true,
        },
      },
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      property: {
        select: {
          id: true,
          name: true,
        },
      },
      rentAgreements: true,
    },
  });
  return newUnit;
}

export async function getUnits(page, limit,searchParams) {
  const propertyId = searchParams.get("propertyId");
  let where;
  if (propertyId && propertyId !== "all") {
    where = {
      propertyId: +propertyId,
    };
  }
  const offset = (page - 1) * limit;
  const units = await prisma.unit.findMany({
    where,
    skip: offset,
    take: limit,
    include: {
      type: {
        select: {
          id: true,
          name: true,
        },
      },
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      property: {
        select: {
          id: true,
          name: true,
        },
      },
      rentAgreements: true,
    },
  });

  const totalUnits = await prisma.unit.count(
        {
          where
        }
  );

  const totalPages = Math.ceil(totalUnits / limit);

  return {
    data: units,
    totalPages,
    total: totalUnits,
  };
}

// Get a single unit by ID
export async function getUnitById(page, limit, searchParams, params) {
  const id = +params.id;

  const unit = await prisma.unit.findUnique({
    where: { id: +id },
    include: {
      type: {
        select: {
          id: true,
          name: true,
        },
      },
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      property: {
        select: {
          id: true,
          name: true,
        },
      },
      rentAgreements: true,
    },
  });
  return {
    data: unit,
  };
}

// Update a unit by ID
export async function updateUnit(id, data) {
  const updateData = {};

  const clientId = data.clientId;
  const typeId = data.typeId;
  delete data.clientId;
  delete data.typeId;

  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) {
      if (
        key === "yearlyRentPrice" ||
        key === "numBedrooms" ||
        key === "floor" ||
        key === "numBathrooms" ||
        key === "numACs" ||
        key === "numLivingRooms" ||
        key === "numKitchens" ||
        key === "numSaloons"
      ) {
        updateData[key] = +data[key];
      } else {
        updateData[key] = data[key];
      }
    }
  });

  if (clientId) {
    updateData.client = {
      connect: {
        id: +clientId,
      },
    };
  }

  if (typeId) {
    updateData.type = {
      connect: {
        id: +typeId,
      },
    };
  }

  const updatedUnit = await prisma.unit.update({
    where: { id: +id },
    data: updateData,
    include: {
      type: {
        select: {
          id: true,
          name: true,
        },
      },
      client: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return updatedUnit;
}

// Delete a unit by ID
export async function deleteUnit(id) {
  const deletedUnit = await prisma.unit.delete({
    where: { id: +id },
  });

  return deletedUnit;
}
