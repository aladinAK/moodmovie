# MoodMovie - Extension Livres

## Nouvelles Fonctionnalités Ajoutées

### 1. Support des Livres
- **API Google Books** : Intégration avec l'API Google Books pour rechercher des livres par sujet
- **Composant BookList** : Affichage des livres avec mise en page similaire aux films
- **Modal de détails** : Modal pour afficher les détails d'un livre et les liens pour l'acheter/prévisualiser

### 2. Système de Navigation
- **Sélecteur de contenu** : Boutons pour basculer entre Films et Livres
- **Mapping des humeurs** : Correspondance entre les humeurs et les sujets de livres
  - Joy → Humor
  - Sadness → Drama
  - Disgust → Horror
  - Fear → Thriller
  - Anger → Action
  - Surprise → Mystery

### 3. Favoris Améliorés
- **Modal avec onglets** : Séparation des favoris entre Films et Livres
- **Compatibilité** : Les livres sont stockés dans le même système que les films
- **Interface unifiée** : Même système de cœur pour ajouter aux favoris

### 4. Nouveaux Fichiers Créés

#### Types
- `types/book.ts` : Interface TypeScript pour les livres

#### API
- `app/api/books/route.ts` : Endpoint pour rechercher des livres via Google Books API

#### Composants
- `components/book-list.tsx` : Liste des livres avec gestion des favoris
- `components/book-details-modal.tsx` : Modal pour afficher les détails et sources d'achat

#### Modifications
- `app/page.tsx` : Ajout du sélecteur Films/Livres et intégration BookList
- `components/favorites-modal.tsx` : Refonte avec onglets pour séparer films et livres

### 5. Sources de Livres
Quand un utilisateur clique sur un livre, le modal propose :
- **Google Books** : Prévisualisation gratuite
- **Google Play Books** : Achat/location
- **Amazon** : Achat

### 6. Architecture
- Réutilisation du système de favoris existant
- Compatibilité avec le système de films existant
- Interface cohérente et intuitive
- Responsive design maintenu

## Comment Utiliser
1. Lancez l'application avec `npm run dev`
2. Cliquez sur "Livres" pour basculer vers les livres
3. Sélectionnez une humeur pour voir des livres correspondants
4. Cliquez sur un livre pour voir les détails et options d'achat
5. Utilisez le cœur pour ajouter aux favoris
6. Consultez vos favoris en cliquant sur "Favorites"

## API Utilisées
- **TMDB** (existant) : Films
- **Google Books** (nouveau) : Livres - API gratuite, pas de clé requise
