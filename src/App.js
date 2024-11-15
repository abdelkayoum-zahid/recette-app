import React, { useState, useEffect } from 'react';
import RecipeCard from './components/RecipeCard';

const APP_ID = '609de65a'; // Remplacez par votre APP_ID réel
const APP_KEY = '25a720420eae4a530717ec3446cc74e7'; // Remplacez par votre APP_KEY réel

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [sortCriteria, setSortCriteria] = useState('calories'); // Ajout pour le tri
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.edamam.com/search?q=${encodeURIComponent(search)}&app_id=${APP_ID}&app_key=${APP_KEY}`
      );
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des recettes.');
      }
      const data = await response.json();
      if (data.hits.length > 0) {
        setRecipes(data.hits.map(hit => hit.recipe));
      } else {
        setError(`Aucune recette trouvée pour "${search}".`);
        setRecipes([]);
      }
    } catch (error) {
      setError("Une erreur est survenue. Veuillez réessayer plus tard.");
      console.error("Erreur lors de la récupération des recettes :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== '') {
      fetchRecipes();
    } else {
      setError('Veuillez entrer un terme de recherche.');
    }
  };

  // Fonction de tri des recettes
  const sortRecipes = (criteria) => {
    let sortedRecipes = [...recipes];
    if (criteria === 'calories') {
      sortedRecipes.sort((a, b) => a.calories - b.calories);
    } else if (criteria === 'time') {
      sortedRecipes.sort((a, b) => (a.totalTime || Infinity) - (b.totalTime || Infinity));
    }
    setRecipes(sortedRecipes);
  };

  useEffect(() => {
    if (recipes.length > 0) {
      sortRecipes(sortCriteria);
    }
  }, [sortCriteria]);

  return (
    <div className="App p-4">
      <form onSubmit={handleSearch} className="mb-4 flex">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une recette..."
          className="border-2 border-gray-300 rounded p-2 flex-grow"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded ml-2"
        >
          Rechercher
        </button>
      </form>

      {error && <p className="text-center text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-center">Chargement des recettes...</p>}

      {recipes.length > 0 && (
        <div className="mb-4">
          <label className="mr-2">Trier par :</label>
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
            className="border-2 border-gray-300 rounded p-2"
          >
            <option value="calories">Calories</option>
            <option value="time">Temps de préparation</option>
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe, index) => (
          <RecipeCard key={index} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default App;
