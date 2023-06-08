// // components/Marquee.js

// import useSWR from 'swr'
// import fetcher from '../lib/utils/fetcher'

// export default function Marquee() {
//   const { data } = useSWR('/api/now-playing', fetcher)
//   const tracks = data?.tracks

//   return (
//     <marquee>
//       {tracks?.length > 0
//         ? tracks.map((track, index) => (
//             <span
//               key={index}
//             >{`Track: ${track.track.name} by ${track.track.artists[0].name}`}</span>
//           ))
//         : 'No recent tracks'}
//     </marquee>
//   )
// }
