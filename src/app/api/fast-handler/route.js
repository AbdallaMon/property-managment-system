import {
  createState,
  getStates,
  createCity,
  createDistrict,
  getCitiesByStateId,
  getDistrictsByCityId,
  createNeighbour,
  getNeighboursByDistrictId,
  createBank,
  getBanks,
  createOwner,
  getOwners,
  createPropertyType,
  getPropertyTypes,
  createRenter,
  getRenters,
  createUnitType,
  getUnitTypes,
  getProperties,
  createUnit,
  getCollectors,
  createCollector,
  getRentTypes,
  createRentType,
  getUnits,
  getContractExpenses,
  createContractExpense,
  getExpenseTypes,
} from "@/services/server/fastHandlers";

const handlerObject = {
  state: {
    POST: createState,
    GET: getStates,
  },
  city: {
    POST: createCity,
    GET: getCitiesByStateId,
  },
  district: {
    POST: createDistrict,
    GET: getDistrictsByCityId,
  },
  neighbour: {
    POST: createNeighbour,
    GET: getNeighboursByDistrictId,
  },
  bank: {
    POST: createBank,
    GET: getBanks,
  },
  owner: {
    POST: createOwner,
    GET: getOwners,
  },
  renter: {
    POST: createRenter,
    GET: getRenters,
  },
  propertyType: {
    POST: createPropertyType,
    GET: getPropertyTypes,
  },
  unitType: {
    POST: createUnitType,
    GET: getUnitTypes,
  },
  properties: {
    GET: getProperties,
  },
  unit: {
    GET: getUnits,
    POST: createUnit,
  },
  collector: {
    GET: getCollectors,
    POST: createCollector,
  },
  rentType: {
    GET: getRentTypes,
    Post: createRentType,
  },
  contractExpenses: {
    GET: getContractExpenses,
    POST: createContractExpense,
  },
  expenseTypes: {
    GET: getExpenseTypes,
  },
};

export async function POST(request, { params }) {
  try {
    const { searchParams } = request.nextUrl;
    const body = await request.json();

    const id = searchParams.get("id");
    const data = await handlerObject[id].POST(body, searchParams);
    return Response.json({ ...data, status: 200, message: "تم الإضافة بنجاح" });
  } catch (error) {
    console.error(error);
    // You can return a response with an error status and message here
    return Response.json({
      status: "error",
      message: "An error occurred while processing your request.",
    });
  }
}

export async function GET(request, { params }) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");
    const data = await handlerObject[id].GET(searchParams);
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({
      status: "error",
      message: "An error occurred while processing your request.",
    });
  }
}
