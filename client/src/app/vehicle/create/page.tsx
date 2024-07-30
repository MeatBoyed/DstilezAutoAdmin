import VehicleForm from "../(components)/VehicleForm";

// Allow user's to request property features for us to add
export default async function CreatePropertyPage() {
  return (
    <section
      id="CreateVehicle"
      className="w-full flex justify-start items-center min-h-screen  "
    >
      <VehicleForm />
    </section>
  );
}
