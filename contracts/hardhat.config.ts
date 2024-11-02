import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://127.0.0.1:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '0xc3de69d79e96aff150e25b405666851cf51750fd638938f9dcba69cc50138cfd',
        '0x54fee3f7fea7d623fdea7a334f7c310a59fd9515f31aade2b2b52692e3cdd417',
        '0x66cb77f2588a99edacbc5f1f8b27f2cdcde1fc836223353c7a642479f48293ae',
        '0x79fd367158d8cea271cd87a60278755fa6f83a177854478b198ad3c505717e77',
        '0xe7cb9776aec4925ec532511a04634c447dc2aeeff2dc0ae53fedb8ca7f000156',
        '0x1cfdc27c4824bccaf69ec354bf5ea04742914d04181db22c80bfac36dc03ffda',
        '0x3ed3f21609a8d2a3f0f0ee3309d14f406456c44054d1b1a354c3d2f38dfa3fc7',
        '0xbddf02825349f40658c2c7701ac13412b832d551c149b8077780827e09ea7109',
        '0x5277ea7ed0ac1ceb9f313f4a6a5586b28cfdfaf4be4eced9ae6383e432c11a3e',
        '0x08b92b04fddab26adafb2f03b53948a786776f358662c7a2e69c4adcf15e31b0'
      ]
    },
  },
};

export default config;
