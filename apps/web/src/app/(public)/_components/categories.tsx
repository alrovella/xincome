import { getWebCompanyCategories } from "@/server/queries/company-categories";

const Categories = async () => {
  const categories = await getWebCompanyCategories();
  if (!categories) return null;

  return (
    <ul className="gap-6 space-y-4 grid lg:grid-cols-3 text-gray-800">
      {categories.map((category) => (
        <li key={category.id}>
          <span className="font-semibold text-primary">{category.name}</span>
          <ul>
            <li>{category.description}</li>
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default Categories;
