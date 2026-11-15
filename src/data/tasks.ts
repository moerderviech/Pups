import type { TaskPeriod } from '../types';
import type { PhaseId } from './cycle';

export interface TaskTemplate {
  id: string;
  /**
   * Platzhalter: {name} = Name des Partners, {drink}, {sweet}, {food}, {flower}, {date}
   * werden aus dem Profil des Partners gefüllt.
   */
  text: string;
  /** Aufgabe wird nur gewählt, wenn der Partner diese Vorliebe eingetragen hat */
  needs?: 'drinks' | 'sweets' | 'food' | 'flowers' | 'dates';
  /** Aufgabe passt besonders gut in diese Zyklusphasen (nur bei Freigabe) */
  phases?: PhaseId[];
}

export const HEARTS: Record<TaskPeriod, number> = { daily: 1, weekly: 5, monthly: 15 };

export const TASKS: Record<TaskPeriod, TaskTemplate[]> = {
  daily: [
    { id: 'd1', text: 'Mach {name} ein ehrliches Kompliment.' },
    { id: 'd2', text: 'Bring {name} das Lieblingsgetränk mit: {drink}.', needs: 'drinks' },
    { id: 'd3', text: 'Schick {name} mitten am Tag eine liebe Nachricht.' },
    { id: 'd4', text: 'Frag {name}, wie der Tag war, und hör wirklich zu.' },
    { id: 'd5', text: 'Umarme {name} heute mindestens 20 Sekunden lang.' },
    { id: 'd6', text: 'Nimm {name} heute eine kleine Aufgabe im Haushalt ab.' },
    { id: 'd7', text: 'Sag {name} Danke für etwas ganz Konkretes.' },
    { id: 'd8', text: 'Finde heute etwas Neues über {name} heraus und trag es ins Buch ein.' },
    { id: 'd9', text: 'Überrasche {name} mit einer Kleinigkeit zum Naschen: {sweet}.', needs: 'sweets' },
    { id: 'd10', text: 'Schick {name} ein Foto, das dich an euch beide erinnert.' },
    { id: 'd11', text: 'Sag {name}, worauf du bei ihr oder ihm stolz bist.' },
    { id: 'd12', text: 'Leg dein Handy weg und schenk {name} 15 Minuten ungeteilte Aufmerksamkeit.' },
    { id: 'd13', text: 'Mach {name} einen Tee oder Kaffee, ohne dass darum gebeten wird.' },
    { id: 'd14', text: 'Schreib {name} einen kleinen Zettel und versteck ihn.' },
    { id: 'd15', text: 'Erzähl {name} von einem schönen Moment, an den du oft denkst.' },
    { id: 'd16', text: 'Frag {name}: „Was kann ich dir heute Gutes tun?“' },
    { id: 'd17', text: 'Schick {name} einen Song, der dich an sie oder ihn erinnert.' },
    { id: 'd18', text: 'Gib {name} einen Kuss auf die Stirn.' },
    { id: 'd19', text: 'Sag {name}, was dir an ihrem oder seinem Aussehen heute besonders gefällt.' },
    { id: 'd20', text: 'Plane für heute Abend zehn Minuten nur zum Reden mit {name} ein.' },
    { id: 'd21', text: 'Bring {name} eine Wärmflasche oder einen warmen Tee.', phases: ['menstruation'] },
    { id: 'd22', text: 'Frag {name}: „Was brauchst du heute?“ und nimm die Antwort ernst.', phases: ['luteal', 'menstruation'] },
    { id: 'd23', text: 'Schlag {name} einen gemütlichen Abend auf dem Sofa vor.', phases: ['luteal', 'menstruation'] },
    { id: 'd24', text: 'Lobe {name} für etwas, das heute gut gelungen ist.' },
  ],
  weekly: [
    { id: 'w1', text: 'Geh mit {name} auf ein Date.' },
    { id: 'w2', text: 'Plane eine spaßige Aktivität für {name}.' },
    { id: 'w3', text: 'Koch für {name} das Lieblingsessen: {food}.', needs: 'food' },
    { id: 'w4', text: 'Macht einen handyfreien Abend zu zweit.' },
    { id: 'w5', text: 'Macht einen Spaziergang an einem Ort, an dem ihr noch nie wart.' },
    { id: 'w6', text: 'Schreibt euch gegenseitig drei Dinge auf, die ihr aneinander liebt.' },
    { id: 'w7', text: 'Bring {name} Blumen mit: {flower}.', needs: 'flowers' },
    { id: 'w8', text: 'Mach mit {name} das Lieblings-Date: {date}.', needs: 'dates' },
    { id: 'w9', text: 'Kocht oder backt zusammen etwas, das ihr noch nie gemacht habt.' },
    { id: 'w10', text: 'Schaut euch zusammen alte Fotos von euch an.' },
    { id: 'w11', text: 'Lass {name} den Film oder die Serie für euren Abend aussuchen.' },
    { id: 'w12', text: 'Macht zusammen Sport oder eine Runde an der frischen Luft.', phases: ['follicular', 'ovulation'] },
    { id: 'w13', text: 'Verwöhne {name} mit einer Massage.', phases: ['luteal', 'menstruation'] },
    { id: 'w14', text: 'Spielt zusammen ein Brett-, Karten- oder Videospiel.' },
  ],
  monthly: [
    { id: 'm1', text: 'Plant einen Ausflug oder Tagestrip.' },
    { id: 'm2', text: 'Schreib {name} einen handgeschriebenen Brief.' },
    { id: 'm3', text: 'Probiert gemeinsam etwas völlig Neues aus: einen Kurs, einen Sport oder ein Restaurant.' },
    { id: 'm4', text: 'Sammelt eure schönsten Fotos des Monats in „Unsere Momente“.' },
    { id: 'm5', text: 'Macht einen Beziehungs-Check-in: Was lief gut, was wünscht ihr euch?' },
    { id: 'm6', text: 'Besorg {name} eine Kleinigkeit vom Geschenke-Board.' },
    { id: 'm7', text: 'Überrasche {name} mit einem Date, das du komplett alleine planst.' },
    { id: 'm8', text: 'Plant zusammen etwas, auf das ihr euch freuen könnt: Urlaub, Konzert oder Wochenende.' },
    { id: 'm9', text: 'Stellt euer erstes Date nach.' },
    { id: 'm10', text: 'Lernt zusammen ein neues Rezept und kocht es für euch beide.' },
  ],
};
