# Bizerte Operations Hub

Ciment de Bizerte — Industrial Monitoring, Maintenance & Cybersecurity Platform

1. Vision générale

Créer une application web professionnelle destinée aux employés, techniciens, ingénieurs, responsables maintenance, responsables production et administrateurs de l'entreprise Les Ciments de Bizerte.

L'application doit centraliser dans une seule plateforme :

l'état des machines industrielles ;

les alarmes et anomalies ;

les problèmes techniques détectés ;

le diagnostic probable d'une panne ;

la maintenance préventive et corrective ;

l'historique des interventions ;

les schémas des machines et des installations ;

les informations techniques des équipements ;

le suivi de la production ;

les informations générales sur l'entreprise ;

la surveillance de l'infrastructure informatique et réseau ;

la détection des problèmes de firewall et de connectivité ;

les notifications importantes ;

les rapports techniques.

L'objectif est de créer un centre numérique de supervision industrielle et de maintenance permettant à un employé de comprendre rapidement :

Quelle machine présente un problème ?
Quel est son état actuel ?
Quelle est l'alarme ?
Quelle peut être la cause ?
Quelle action faut-il effectuer ?
Qui est responsable de l'intervention ?
Depuis combien de temps le problème existe-t-il ?
Le problème est-il industriel, électrique, mécanique, réseau ou informatique ?

L'application doit avoir une apparence moderne, industrielle, professionnelle et adaptée à une cimenterie.

2. Nom de l'application

Nom principal :

Ciment Bizerte — Industrial Control Center

Nom court :

CBI Control

Sous-titre :

Industrial Monitoring • Maintenance • Production • Cybersecurity

3. Design général

Créer une interface professionnelle inspirée des logiciels industriels SCADA/HMI modernes, mais avec une UX beaucoup plus moderne.

Style :

industriel ;

professionnel ;

sobre ;

moderne ;

haute lisibilité ;

responsive ;

desktop-first ;

compatible tablette ;

compatible mobile pour les techniciens.

Palette :

bleu industriel foncé ;

bleu acier ;

gris clair ;

blanc ;

orange pour les avertissements ;

rouge pour les problèmes critiques ;

vert pour les équipements opérationnels ;

jaune pour les avertissements ;

bleu clair pour les informations.

Ne pas surcharger l'interface.

Utiliser des cartes, badges, graphiques, timelines, tableaux et diagrammes techniques.

4. Authentification

Créer une page Login.

Champs :

matricule / username ;

mot de passe.

Ajouter :

Remember me ;

Forgot password ;

connexion sécurisée ;

indication du rôle de l'utilisateur.

Créer plusieurs rôles :

Administrateur

Accès complet.

Responsable maintenance

Accès aux machines, alarmes, interventions et maintenance.

Ingénieur

Accès aux données techniques, diagnostics, historiques et schémas.

Opérateur

Accès principalement aux équipements, alarmes et procédures.

Responsable production

Accès production, équipements et statistiques.

Responsable IT / Cybersecurity

Accès réseau, serveurs, firewall, incidents cyber et logs.

5. Dashboard principal

Après connexion, afficher un dashboard industriel.

En haut :

Bonjour, [Nom utilisateur]

Afficher :

date ;

heure ;

shift actuel ;

état général de l'usine.

Créer des KPI cards :

État de l'usine

Operational

Warning

Critical

Machines

Total machines

Machines opérationnelles

Machines en warning

Machines en panne

Alarmes

Critical alarms

Active alarms

Resolved alarms

Maintenance

Planned maintenance

Maintenance in progress

Overdue maintenance

Cybersecurity

Firewall status

Network incidents

Suspicious events

Blocked connections

6. Vue globale de l'usine

Créer une page :

Plant Overview

Afficher un schéma simplifié de l'usine.

Organiser le processus selon les étapes :

Carrière

Extraction

Concassage

Transport des matières premières

Préhomogénéisation

Broyage cru

Homogénéisation

Préchauffage

Four

Refroidissement clinker

Stockage clinker

Broyage ciment

Stockage ciment

Ensachage

Expédition

Chaque zone doit être cliquable.

Exemple :

CARrière → Concasseur → Préhomogénéisation → Broyeur Cru → Four → Refroidisseur → Clinker → Broyeurs Ciment → Silos → Ensachage.

Afficher une couleur selon l'état :

VERT = normal

JAUNE = avertissement

ORANGE = anomalie

ROUGE = panne critique

GRIS = arrêté

BLEU = maintenance

7. Page Machines

Créer une page :

Machines & Equipment

Afficher toutes les machines sous forme de tableau + cartes.

Colonnes :

Machine ID

Nom

Zone

Type

État

Dernière alarme

Température

Vibration

Charge

Dernière maintenance

Prochaine maintenance

Responsable

Ajouter une recherche :

Search machine...

Filtres :

Zone

État

Type

Niveau de criticité

Maintenance

Alarmes

8. Fiche détaillée d'une machine

Lorsqu'un utilisateur clique sur une machine, ouvrir une page détaillée.

Exemple :

Broyeur Cru 3F1

Afficher :

Machine ID :

3F1

Type :

PFEIFFER MPS 3750

Puissance moteur :

1675 kW

Débit :

310 t/h

Afficher :

État actuel

🟢 Operational

Paramètres

Motor temperature

Bearing temperature

Vibration

Motor current

Motor power

Grinding pressure

Material flow

Separator speed

Gas temperature

Gas flow

Afficher les valeurs avec graphiques temps réel.

Créer des graphiques :

Temperature / time

Vibration / time

Motor load / time

Pressure / time

Production / time

9. Diagnostic intelligent

Ajouter une fonctionnalité très importante :

AI Diagnostic

Chaque machine possède un bouton :

Analyze Machine

Lorsqu'il est utilisé, l'application analyse :

alarmes ;

valeurs des capteurs ;

historique ;

maintenance précédente ;

température ;

vibration ;

courant moteur ;

pression ;

état des composants.

Afficher :

Detected Problem

Exemple :

Abnormal bearing temperature

Severity

Critical

Probability

87%

Possible causes

Bearing lubrication problem

Mechanical friction

Bearing wear

Excessive load

Recommended actions

Stop machine according to safety procedure.

Inspect bearing temperature.

Verify lubrication.

Check vibration.

Inspect mechanical components.

Important :

L'IA doit présenter le diagnostic comme une aide à la décision et non comme une certitude absolue.

Afficher :

AI-generated diagnosis — technician validation required.

10. Système d'alarmes

Créer une page :

Alarm Center

Afficher toutes les alarmes.

Colonnes :

Date

Heure

Machine

Zone

Alarm

Severity

Status

Technician

Resolution

Niveaux :

Critical

Rouge

High

Orange

Medium

Jaune

Low

Bleu

Ajouter :

acknowledge alarm ;

assign technician ;

add comment ;

mark as resolved ;

create maintenance ticket.

11. Maintenance

Créer une page :

Maintenance Management

Sections :

Preventive Maintenance

Afficher :

maintenance prévue ;

date ;

machine ;

type ;

responsable ;

durée estimée.

Corrective Maintenance

Afficher :

panne ;

machine ;

diagnostic ;

technicien ;

statut.

Statuts :

Open

Assigned

In Progress

Waiting Parts

Resolved

Closed

Créer un système de ticket.

Exemple :

Ticket #CBI-2026-00124

Machine :

Broyeur ciment 1

Problem :

High motor temperature

Priority :

High

Assigned to :

Maintenance Team A

12. Historique des machines

Chaque machine doit avoir une timeline.

Exemple :

2026-08-25 — Alarm detected

2026-08-25 — Technician assigned

2026-08-25 — Bearing inspected

2026-08-26 — Maintenance completed

2026-08-27 — Machine restarted

Cela permet de connaître tout l'historique d'une machine.

13. Schémas techniques

Créer une section :

Technical Schematics

Afficher des schémas interactifs.

Créer plusieurs catégories :

Process diagrams

Electrical diagrams

Mechanical diagrams

Instrumentation

Conveyor systems

Hydraulic systems

Pneumatic systems

Network architecture

Les schémas doivent être zoomables.

Les composants doivent être cliquables.

Exemple :

Four → cliquer → afficher :

Four ID

dimensions

temperature

speed

burner

maintenance

alarms.

14. Schéma du procédé cimentier

Créer un diagramme interactif :

Raw Materials

Calcaire + Marne + Minerai de fer

↓

Crusher

Concassage

↓

Prehomogenization

Stock HT / BT

↓

Raw Mill

Broyeur cru

↓

Homogenization Silos

Silos de farine crue

↓

Preheater

Préchauffeur

↓

Rotary Kiln

Four

↓

Clinker Cooler

Refroidisseur POLYTRACK

↓

Clinker Storage

Stock clinker

↓

Cement Mills

Broyeurs ciment

↓

Cement Silos

Silos ciment

↓

Packaging

Ensachage

↓

Shipping

Camions / wagons / bateaux

Chaque étape doit être cliquable.

15. Données techniques de l'entreprise

Créer une page :

Company Information

Titre :

Les Ciments de Bizerte

Sections :

Présentation

Activité

Processus industriel

Produits

Infrastructure

Qualité

Environnement

Stockage

Expédition

Présenter le processus de fabrication sous forme graphique.

Le procédé décrit par l'entreprise suit principalement quatre grandes étapes :

extraction et concassage des matières premières ;

préparation de la poudre crue ;

cuisson du clinker ;

mouture du ciment.

Utiliser ces informations comme base documentaire de l'application.

16. Équipements importants à intégrer

Préconfigurer les équipements documentés dans l'application.

Concasseur

Type :

THYSSEN grupp

Débit :

1000 t/h

Granulométrie d'entrée maximale :

1500 × 1000 × 700 mm

Granulométrie de sortie :

0–60 mm.

Broyeur cru

ID :

3F1

Type :

PFEIFFER MPS 3750 modifié

Puissance :

1675 kW

Débit :

310 t/h

Séparateur :

PFEIFFER SLS 3750B

Puissance séparateur :

132 kW

Four

ID :

4K1.KN01

Type :

POLYSIUS

Capacité nominale :

4000 t/j de clinker

Longueur :

83 m

Diamètre :

5,18 m

Vitesse maximale :

4 tr/min

Combustibles :

Coke de pétrole + fuel lourd N°2

Refroidisseur clinker

ID :

4R1.PQ01

Type :

POLYTRACK

Surface :

86 m²

Broyeurs ciment

Type :

UNIDAN 44 × 13

Nombre :

2

Débit :

100 t/h par broyeur

Ensachage

Créer les équipements :

4 ensacheuses rotatives ciment

1 ensacheuse rotative chaux

2 installations BIG BAGS

Ces informations doivent apparaître dans les fiches techniques.

17. Laboratoire / contrôle qualité

Créer une section :

Quality Control

Ajouter les équipements de laboratoire.

L'image fournie montre un :

Thermo Scientific ARL 9900 Series X-Ray Workstation

Créer une fiche équipement :

Equipment name

Manufacturer

Model

Status

Last calibration

Next calibration

Samples analyzed

Results

Alerts

Créer également une section :

Laboratory Results

Afficher :

sample ID ;

date ;

material ;

analysis;

result ;

specification ;

status.

18. Surveillance réseau et Firewall

Créer une section complètement séparée :

IT & Cybersecurity

Cette partie doit permettre de surveiller l'infrastructure informatique de l'usine.

Créer une page :

Network Monitoring

Afficher :

Servers

Workstations

PLC networks

SCADA servers

Industrial network

Switches

Routers

Firewall

Internet connection

Afficher leur état :

🟢 Online

🟡 Warning

🔴 Offline

19. Firewall Monitoring

Créer une page :

Firewall Security

Afficher :

Firewall Status

Online / Offline

CPU usage

Memory usage

Uptime

Active connections

Security events

Blocked connections

Allowed connections

Port scanning

Failed authentication

Suspicious IP

Malware alerts

Unauthorized access attempts

Créer des graphiques :

Connections over time

Blocked traffic

Allowed traffic

Suspicious traffic

20. Détection des problèmes Firewall

Ajouter une fonctionnalité :

Firewall Diagnostics

L'application doit détecter les anomalies à partir des logs et données disponibles.

Exemples :

Problem detected

Repeated connection attempts from unknown IP

Severity :

High

Source :

192.168.x.x

Destination :

10.x.x.x

Port :

502

Protocol :

TCP

Possible issue :

Unauthorized access attempt to an industrial service.

Recommended action :

Verify source device

Check firewall rules

Review network logs

Contact cybersecurity administrator

21. Industrial cybersecurity

Créer une page :

OT Security

Surveiller particulièrement les réseaux industriels.

Afficher :

PLC

SCADA

HMI

Industrial servers

Engineering workstations

Network switches

Firewall

Industrial protocols

Créer une carte réseau interactive.

Exemple :

Internet
↓
Firewall
↓
IT Network
↓
DMZ
↓
SCADA Server
↓
Industrial Network
↓
PLC
↓
Machines

Important :

Ne jamais permettre à l'application de modifier directement une machine industrielle ou une règle firewall sans autorisation explicite.

L'application doit être principalement un système de monitoring et d'aide au diagnostic.

22. Notifications

Créer un système de notifications.

Exemples :

🔴 Critical machine failure

🟠 High temperature detected

🟡 Preventive maintenance due tomorrow

🔵 Network connection lost

🔴 Firewall security event

🟢 Maintenance completed

Permettre aux utilisateurs de filtrer les notifications.

23. Rapports

Créer une page :

Reports

Permettre de générer :

Daily Production Report

Machine Status Report

Maintenance Report

Alarm Report

Energy Report

Cybersecurity Report

Firewall Report

Incident Report

Exporter en :

PDF

Excel

CSV

24. Statistiques

Créer une page :

Analytics

Afficher :

Machine availability

MTBF

MTTR

Number of failures

Downtime

Maintenance cost

Production efficiency

Alarm frequency

Energy consumption

Network incidents

Graphiques interactifs.

Filtres :

Today

7 days

30 days

3 months

1 year

Custom range

25. Carte des silos

Créer une page interactive :

Silos

Afficher les silos et leur capacité.

Données documentées :

Silo 1 — CEM II/A-L 32,5 N — 2500 tonnes

Silo 2 — CEM I 42,5 N — 2500 tonnes

Silo 3 — CEM II/A-L 32,5 N — 10 000 tonnes

Silo 4 — CEM I 42,5 N — 10 000 tonnes

Silo 5 — CEM I 42,5 N — 10 000 tonnes

Silo Bleu — ciment pour chaux — 750 tonnes

Silo Noir — poudre pour chaux — 750 tonnes

Silo Vert — chaux artificielle CHA 10 — 750 tonnes

Silo Homo — poudre crue — capacité indiquée dans la documentation.

Afficher pour chaque silo :

capacité ;

niveau actuel ;

produit ;

température ;

état ;

dernier remplissage ;

dernière extraction.

26. Interface SCADA simplifiée

Créer une page :

Process Monitoring

Inspirée de l'interface de supervision industrielle visible sur les images fournies.

Afficher :

convoyeurs ;

moteurs ;

broyeurs ;

silos ;

vannes ;

élévateurs ;

ventilateurs ;

fours ;

refroidisseurs.

Chaque composant doit changer de couleur selon son état.

Exemple :

Moteur vert = fonctionnement normal.

Moteur jaune = avertissement.

Moteur rouge = panne.

Moteur gris = arrêté.

Cliquer sur un équipement ouvre sa fiche détaillée.

27. Recherche globale

Créer une recherche globale.

L'utilisateur peut rechercher :

machine ;

code équipement ;

alarme ;

technicien ;

ticket ;

schéma ;

procédure ;

incident réseau ;

firewall event.

Exemple :

Search :

4K1.KN01

Résultat :

Four POLYSIUS

Afficher directement :

état ;

alarmes ;

paramètres ;

historique ;

maintenance ;

schéma technique.

28. Base documentaire

Créer une page :

Documentation

Catégories :

Machine manuals

Maintenance procedures

Safety procedures

Technical drawings

Electrical diagrams

Network documentation

Quality procedures

Production procedures

Permettre l'upload de documents PDF.

Chaque document peut être associé à une machine.

29. Architecture technique

Créer l'application avec une architecture moderne.

Frontend :

React + TypeScript

UI :

Tailwind CSS + shadcn/ui

Charts :

Recharts

Icons :

Lucide React

Backend :

Utiliser une architecture compatible avec une API REST.

Database :

PostgreSQL

Authentication :

Role-based authentication.

Prévoir une architecture permettant plus tard de connecter :

API industrielle ;

OPC-UA ;

MQTT ;

SCADA ;

PLC ;

historian ;

firewall API ;

SIEM.

30. Mode démo

Comme les données industrielles réelles ne sont pas encore disponibles, créer un Demo Mode.

Générer des données réalistes simulées.

Exemples :

Machine :

Broyeur Cru 3F1

Temperature :

78°C

Vibration :

3.2 mm/s

Motor load :

82%

Status :

Warning

Créer plusieurs machines avec différentes situations.

Important :

Afficher clairement :

SIMULATED DATA

pour toutes les données qui ne proviennent pas d'une source réelle.

Ne jamais présenter des données simulées comme des données réelles de l'usine.

31. Page Machine avec incident simulé

Créer au moins un exemple très complet.

Machine :

Broyeur Ciment 1

Status :

🔴 Critical

Problem :

Abnormal motor temperature

Temperature :

94°C

Normal range :

< 85°C

Vibration :

7.1 mm/s

Motor load :

96%

AI analysis :

Possible mechanical overload / bearing issue.

Actions :

Check motor load.

Check bearing temperature.

Check lubrication.

Check vibration.

Inspect mechanical components.

Escalate to maintenance engineer.

Créer un bouton :

Create Maintenance Ticket

32. Page incident cybersécurité

Créer un exemple.

Incident :

Suspicious connection detected

Severity :

High

Source :

Unknown device

Destination :

Industrial network

Protocol :

TCP

Status :

Investigating

Actions :

Investigate device

Review firewall logs

Assign cybersecurity engineer

Create incident report

33. UX

L'application doit être extrêmement simple pour un employé.

Lorsqu'il arrive sur le dashboard, il doit comprendre immédiatement :

Tout va bien

ou

Il existe un problème.

Le dashboard doit afficher en priorité les problèmes critiques.

Créer une section :

Critical Issues

Exemple :

🔴 Broyeur ciment 1 — Motor temperature high

🔴 Firewall — suspicious traffic detected

🟠 Conveyor C5 — abnormal vibration

34. Page détail problème

Créer une page :

Problem Details

Afficher :

Problem ID

Date

Machine

Zone

Severity

Detection method

Sensor values

Possible causes

AI diagnosis

Recommended action

Assigned technician

Status

Comments

Attachments

Resolution

Resolution date

Ajouter une timeline.

35. Sécurité de l'application

Ajouter :

JWT/session authentication ;

RBAC ;

password hashing ;

audit logs ;

session timeout ;

login history ;

action history.

Chaque action importante doit être enregistrée.

Exemple :

User Ahmed changed ticket status from In Progress → Resolved.

36. Audit Log

Créer une page :

Audit Logs

Afficher :

User

Action

Resource

Date

IP

Result

Exemples :

User logged in.

Machine viewed.

Maintenance ticket created.

Alarm acknowledged.

Report generated.

Cybersecurity incident assigned.

37. Responsive design

Desktop :

interface complète.

Tablet :

interface adaptée aux techniciens.

Mobile :

interface simplifiée avec priorité sur :

Critical alerts

Machine status

Maintenance tickets

Notifications.

38. Menu principal

Sidebar :

Dashboard

Plant Overview

Machines

Process Monitoring

Alarms

Maintenance

Technical Schematics

Production

Quality Control

Silos

IT Monitoring

Firewall Security

OT Security

Cyber Incidents

Reports

Documentation

Users

Audit Logs

Settings

39. Dashboard visuel

Le dashboard doit contenir :

Top bar :

Logo Ciments de Bizerte

Search

Notifications

User profile

Sidebar :

Navigation

Main :

Plant status

Machine status

Critical alarms

Production

Maintenance

Cybersecurity

Recent incidents

Machine map

40. Important — ne pas créer une fausse connexion industrielle

Pour cette première version, l'application doit fonctionner avec des données simulées.

Préparer cependant l'architecture afin qu'une future version puisse récupérer les données réelles depuis :

SCADA ;

PLC ;

OPC-UA ;

MQTT ;

API ;

bases de données industrielles ;

firewall ;

SIEM.

Créer des interfaces/API abstraites pour permettre cette intégration plus tard.

Ne jamais envoyer automatiquement de commandes aux PLC ou aux machines.

41. Objectif final

Le résultat doit ressembler à un véritable :

Industrial Operations & Maintenance Center

et non à une simple application CRUD.

L'utilisateur doit pouvoir passer de :

Plant

→ Production Zone

→ Machine

→ Sensor

→ Alarm

→ Diagnosis

→ Maintenance Ticket

→ Resolution

→ Historical Report

dans quelques clics.

La deuxième partie doit permettre :

Network

→ Firewall

→ Security Event

→ Diagnosis

→ Incident

→ Resolution

→ Security Report.

42. Données et documentation

Utiliser les informations techniques fournies dans la documentation des Ciments de Bizerte comme contenu initial.

Ne pas inventer les caractéristiques techniques lorsqu'elles ne sont pas disponibles.

Lorsqu'une donnée réelle n'est pas disponible :

Afficher :

N/A

ou

Data not available

et utiliser les données simulées uniquement dans le Demo Mode.

Ajouter une indication :

Source: Ciments de Bizerte technical documentation

pour les informations documentaires.

43. Résultat attendu de Lovable

Créer une application complète avec :

Login ;

Dashboard ;

Plant Overview ;

SCADA-style Process Monitoring ;

Machines ;

Machine Details ;

AI Diagnostic interface ;

Alarm Center ;

Maintenance Management ;

Technical Schematics ;

Production monitoring ;

Quality Control ;

Silos ;

IT Monitoring ;

Firewall Monitoring ;

OT Cybersecurity ;

Cyber Incidents ;

Reports ;

Documentation ;

Users ;

Audit Logs ;

Settings.

Créer plusieurs pages fonctionnelles et navigables.

Utiliser des données de démonstration réalistes.

L'application doit être visuellement impressionnante, professionnelle et suffisamment réaliste pour être présentée comme un prototype de solution numérique destinée à une cimenterie industrielle.

Ne pas simplement créer des cartes statiques.

Les boutons, filtres, recherches, tableaux, graphiques, modales, pages de détail et navigations doivent fonctionner dans le prototype.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://kiln-guardian.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/17d9835f-67e6-4b56-b142-4668c533cb0f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
