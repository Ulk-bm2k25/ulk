# Gestion-des-notifications-groupe-2
groupe2

## Documentation du projet  Laravel
Les notifications sont générés dans le fichier backend\app\helpers\notify.php 
la fonction notify est accessible de partout 
Elle prend en parametre $userId (id de l'utilisateur connecté),  $title( le titre de la notif Informations , Remboursement , Payement ),  $content (contenu et corps de la notif ), $type( type de la notif payment_success , payment_echoue , infos_system ) dans ce ordre 
Pour aller vite des modeles de notifications sont déjà crées et utilisables
Il s'agit de 
notifyPaymentSuccess(int $userId, string $amount)

notifyPaymentFailed(int $userId, string $amount)

notifyPaymentWaited(int $userId, string $amount)

notifyPaymentInfos(int $userId, string $amount)

notifyPaymentRemboursement(int $userId, string $amount)

Ils prennent en parametre juste l'id du user connecté et le montant en question

Par conséquent dans l'une des fonctions qui gère un payment ou alors un remboursement on peut juste ajouter notifyPaymentSuccess(user->id , 100000) pour générer cette notif dans la bdd et la rendere accessible au front


## Documentation du projet REACT  
Les notifications générés par le backend parviennent au front REACT par requettes HTPP . Ces dernieres sont gérés par VITE et nécéssite forcément un token correspondant àun utilisateur connecté .
Le fichier api.js centralise le comportement des requêtes HTTP vers l’endpoint principal :

http://localhost:8000/api


Toutes les requêtes vers le backend passent par ce fichier, ce qui permet une gestion centralisée des headers, du token et des erreurs.

les différentes fonctionnalités présentés sont dévéloppés au niveau de notificationService.jsx on n'a donc :

getAll() : pour récupérer et afficher toutes les notifications

markAsRead(notificationId) qui marque une notification comme lue en prenant en paramètres l'id de l'utilisateur 

markAllAsRead() :pour marquer toutes les notifications comme lues 

delete(notificationId) :pour supprimer une notification

Le store notificationStore.js gère l’état des notifications côté front.

Il met à jour les variables lorsque des modifications sont effectuées (lecture, suppression, etc.).

Il enregistre l’état actuel des notifications pour assurer une synchronisation constante avec l’interface utilisateur.







