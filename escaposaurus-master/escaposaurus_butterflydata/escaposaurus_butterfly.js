<!--
/////////////////////////////////////////////////////////////
/// Escapausorus v1 (2020)
///	A quick and dirty framework to create small adventure game (certified vanilla JS)
/// Author: Stéphanie Mader (http://smader.interaction-project.net)
/// GitHub: https://github.com/RedNaK/escaposaurus
///	Licence: MIT
////////////////////////////////////////////////////////////
-->

	/*
		HERE IS THE CONFIGURATION OF THE GAME
	*/
		/*either online with VOD server and JSON load of data
		either local */
		var isLocal = true ;
 		var gameRoot = "./" ;
 		var gameDataRoot = gameRoot+"escaposaurus_butterflydata/" ;
 		var videoRoot = gameDataRoot+"videos/" ;

 		/*caller app*/
		var contactVideoRoot = videoRoot+"contactVideo/" ;

		/*full path to intro / outro video*/
		var missionVideoPath = videoRoot+"introVideo/intro1.mp4" ;
		var introVideoPath = videoRoot +"introVideo/intro2.mp4" ;
		var missingVideoPath = videoRoot+"contactVideo/missing/final.mp4" ;
		var epilogueVideoPath = videoRoot+"epilogueVideo/epiloguecredit.mp4" ;

		/*udisk JSON path*/
		var udiskRoot = gameDataRoot+"udisk/" ;

		/*for online use only*/
		/*var udiskJSONPath = gameRoot+"escaposaurus_gamedata/udisk.json" ;
		var udiskJSONPath = "/helper_scripts/accessJSON_udisk.php" ;*/

		var udiskData =
		{
			"root": {
	  			"folders":
		  		[{
					"foldername": "SecretAgents",
					"folders":
						[{
							"foldername": "Butterfly1",
							"folders":
								[{
									"foldername": "Monarque_Position",
									"files": ["Monarque_positionGPS.png"],
									"password": "baudelaire",
									"sequence": 1
								}],
							"files": ["liste_livres.png", "diplome_litterature.png"], "password": "monarque", "sequence": 0
						},
							
						{
							"foldername": "Butterfly2",
							"folders":
								[{
									"foldername": "Myrtil_Position",
									"files": ["Myrtil_positionGPS.png"],
									"password": "47",
									"sequence": 3
								}],
							"files": ["probleme.png", "diplome_mathematiques.png"], "password": "myrtil", "sequence": 2
						},

						{
							"foldername": "Butterfly3",
							"folders":
								[{
									"foldername": "Macaon_Position",
									"files": ["Macaon_positionGPS.png"],
									"password": "3",
									"sequence": 5
								}],
							"files": ["Article_expo.png", "painting.jpg"], "password": "macaon", "sequence": 4
						},

						{
							"foldername": "Butterfly4",
							"folders":
								[{
									"foldername": "Vulcain_Position",
									"files": ["Vulcain_positionGPS.png"],
									"password": "161225",
									"sequence": 7
								}],
							"files": ["Correspondance_agent.png", "coupurePresse1.png", "coupurePresse2.png", "coupurePresse3.png"], "password": "vulcain", "sequence": 6
						}]
				}],
				"files":
				[
					"Memo.png"
				]}
		} ;

		var gameTitle = "Opération Butterfly" ;
		var gameDescriptionHome = "Le pays dans lequel le personnage que vous jouez est sous le joug d'un dicatateur. Quatre des membres les plus importantes de la résistance, les sœurs papillons, sont en danger. Votre personnage est chargé de les retrouver. Vous disposez pour cela de données laissées par les papillons. Bonne chance !" ;
		var gameMissionCall = "" ;
		var gameMissionAccept = "&raquo;&raquo; Accepter la mission et rechercher la position des membres de la resistance (JOUER) &laquo;&laquo;" ;

		var gameCredit = "Un jeu conçu et réalisé par : <br/>Antonin Lombard<br/>Théodore Laborde<br/>Gabriel Purnelle<br/>Tom Dexport<br/>Matthéo Blivet<br/>Louis Vogel" ;
		var gameThanks = "" ;

		var OSName = "ArchLinux 6.4.12 - diskloaded: ResistanceData" ;
		var explorerName = "FILE EXPLORER" ;
		var callerAppName = "INITIATE COMMUNICATION" ;

		/*titles of video windows*/
		var titleData = {} ;
		titleData.introTitle = "INTRODUCTION" ;
		titleData.epilogueTitle = "EPILOGUE" ;
		titleData.callTitle = "COMMUNICATION EN COURS..." ;

		/*change of caller app prompt for each sequence*/
		var promptDefault = "Pas de signal." ;
		var prompt = [] ;
		prompt[0] = "Pas de signal";
		prompt[1] = "Pas de signal";
		prompt[2] = "Contacter l'agent / Regarder la presse";
		prompt[3] = "Pas de signal";
		prompt[4] = "Contacter l'agent / Regarder la presse";
		prompt[5] = "Pas de signal";
		prompt[6] = "Contacter l'agent / Regarder la presse";
		prompt[7] = "Pas de signal";
		prompt[8] = "Communiquer la position de la resistante à l'agent";

		/*when the sequence number reach this, the player win, the missing contact is added and the player can call them*/
		var sequenceWin = 8 ;

		/*before being able to call the contacts, the player has to open the main clue of the sequence as indicated in this array*/
		/*if you put in the string "noHint", player will be able to immediatly call the contact at the beginning of the sequence*/
		/*if you put "none" or anything that is not an existing filename, the player will NOT be able to call the contacts during this sequence*/
		var seqMainHint = [] ;
		seqMainHint[0] = "Memo.png" ;
		seqMainHint[1] = "liste_livres.png" ;
		seqMainHint[2] = "Monarque_positionGPS.png" ;
		seqMainHint[3] = "probleme.png" ;
		seqMainHint[4] = "Myrtil_positionGPS.png" ;
		seqMainHint[5] = "painting.jpg" ;
		seqMainHint[6] = "Macaon_positionGPS.png" ;
		seqMainHint[7] = "Correspondance_agent.png" ;

		/*contact list, vid is the name of their folder in the videoContact folder, then the game autoload the video named seq%number of the current sequence%, e.g. seq0.MP4 for the first sequence (numbered 0 because computer science habits)
	their img need to be placed in their video folder, username is their displayed name
		*/
		var normalContacts = [] ;
		normalContacts[0] = {"vid" : "Agent", "vod_folder" : "", "username" : "Agent", "canal" : "video", "avatar" : "agent_avatar.png"} ;
		normalContacts[1] = {"vid" : "Presse", "vod_folder" : "", "username" : "Presse", "canal" : "video", "avatar" : "presse_avatar.png"} ;

		/*second part of the list, contact that can help the player*/
		var helperContacts = [] ;
		helperContacts[0] = { "vid": "Boss", "vod_folder": "", "username": "Boss (indice)", "canal": "txt", "avatar": "bossoriginal.png", "bigAvatar": "bossoriginal.png"} ;
		/*helperContacts[1] = {"vid" : "Lou", "username" : "Lou (pour avoir un deuxième indice) - par message", "canal" : "txt", "avatar" : "Lou_opt.jpg", "bigAvatar" : "avatarHelper2Big.gif"} ;*/


		/*ce qui apparait quand on trouve le dernier élément du disque dur*/
		finalStepAdded = "Vous avez trouvé la position de <b>Vulcain</b> ! Appelez l'agent pour l'en informer." ;

		/*the last call, it can be the person we find in the end or anyone else we call to end the quest, allows the game to know it is the final contact that is called and to proceed with the ending*/
var missingContact = { "vid": "missing", "vod_folder": "", "username": "Agent", "canal": "video", "avatar": "agent_avatar.png"} ;

		/*Lou only send text message, they are stored here*/
		var tips = {} ;
		tips['Boss'] = [] ;
		tips['Boss'][0] = "Le nom de code de la personne que l'on recherche est <b>Monarque</b>." ;
		tips['Boss'][1] = " Le MDP concerne l'auteur de sa thèse. Il me semble que son œuvre phare est partiellement lisible sur son diplôme." ;
		tips['Boss'][2] = "Cette fois ci, nous recherchons la position de <b>Myrtil</b>. Au travail !" ;
		tips['Boss'][3] = "De manière logique, le cocon semble être égal à 21..." ;
		tips['Boss'][4] = "Je sais que nous n'avons pas eu de chance jusque là, mais faites de votre mieux pour retrouver <b>Macaon</b>." ;
		tips['Boss'][5] = "Les papillons sont tous situés aux abords du bouquet. Combien y en a-t-il ?" ;
		tips['Boss'][6] = "Cette résistante est notre dernier espoir. Vous devez trouver <b>Vulcain</b> !" ;
		tips['Boss'][7] = "Notre espion a dû disséminer le MDP sur les différents journaux sans toucher directement aux articles... Il faut chercher hors du cadre." ;


		/*text for the instruction / solution windows*/
		var instructionText = {} ;
		instructionText.winState = "Vous avez retrouvé l'id GPS et vous pouvez envoyer l'agent." ;
		instructionText.lackMainHint = "" ;
		instructionText.password = "Vous devez trouver et entrer le mot de passe d'un des dossiers de la boite de droite. Vous pouvez trouver le mot de passe en appelant les contacts de la boite de gauche.<br/>Pour entrer un mot de passe, cliquez sur le nom d'un dossier et une fenêtre s'affichera pour que vous puissiez donner le mot de passe." ;

		/*please note the %s into the text that allow to automatically replace them with the right content according to which sequence the player is in*/
		var solutionText = {} ;
		solutionText.winState = "Vous avez secouru Vulcain. Bien joué !" ;
		solutionText.lackMainHint = "Vous devez ouvrir le fichier <b>%s</b><br/>" ;
		solutionText.password = "Vous devez déverouiller le dossier <b>%s1</b><br/>avec le mot de passe : <b>%s2</b><br/>" ;