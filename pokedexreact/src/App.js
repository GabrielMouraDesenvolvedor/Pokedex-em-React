import React, { useState } from 'react';
import './App.css'; // Certifique-se de ter um arquivo CSS para estilizar

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [pokemonDetails, setPokemonDetails] = useState(null); // Detalhes do Pokémon após a pesquisa

  const getGeneration = (id) => {
    if (id >= 1 && id <= 151) return 'Geração I';
    if (id >= 152 && id <= 251) return 'Geração II';
    if (id >= 252 && id <= 386) return 'Geração III';
    if (id >= 387 && id <= 493) return 'Geração IV';
    if (id >= 494 && id <= 649) return 'Geração V';
    if (id >= 650 && id <= 721) return 'Geração VI';
    if (id >= 722 && id <= 809) return 'Geração VII';
    if (id >= 810) return 'Geração VIII';
    return 'Desconhecida';
  };

  const handleSearch = async () => {
    if (search.trim() === '') {
      alert('Por favor, insira um nome de Pokémon para pesquisar.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`);
      if (!response.ok) {
        throw new Error('Pokémon não encontrado');
      }
      const data = await response.json();
      setPokemons([{
        name: data.name,
        image: data.sprites.front_default,
        stats: data.stats,
        id: data.id // Adiciona o ID para determinar a geração
      }]); // Atualiza a lista de pokémons com o Pokémon encontrado
      setPokemonDetails(data); // Salva os detalhes do Pokémon encontrado
    } catch (error) {
      setError('Pokémon não encontrado.');
      console.error('Erro ao buscar Pokémon:', error);
      setPokemons([]); // Limpa a lista de Pokémon em caso de erro
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com a tecla Enter no campo de pesquisa
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); // Se a tecla pressionada for Enter, chama a função de busca
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokédex</h1>

        {/* Campo de pesquisa e botão */}
        <input
          type="text"
          placeholder="Digite o nome do Pokémon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown} // Adiciona o evento para a tecla Enter
        />
        <button onClick={handleSearch}>Pesquisar</button>

        {error && <p>{error}</p>}
        {loading && <p>Carregando Pokémon...</p>}

        {/* Exibe o Pokémon encontrado após a pesquisa */}
        {pokemons.length > 0 && (
          <div className="pokemon-card">
            <img className="pokemon-image" src={pokemons[0].image} alt={pokemons[0].name} />
            <h2>{pokemons[0].name}</h2>
            <p>Geração: {getGeneration(pokemons[0].id)}</p>
            <div className="pokemon-stats">
              <h3>Atributos:</h3>
              <ul>
                {pokemons[0].stats.map((stat, index) => (
                  <li key={index}>
                    {stat.stat.name}: {stat.base_stat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default App;
