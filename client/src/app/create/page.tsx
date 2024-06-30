import VehicleForm from "../_comp/VehicleForm";

// Allow user's to request property features for us to add
export default async function CreatePropertyPage() {
  return (
    <section
      id="CreateVehicle"
      className="w-full flex justify-start items-center gap-10  pb-20  my-3 flex-col px-3 sm:px-5 min-h-screen  "
    >
      <VehicleForm />
    </section>
  );
}
