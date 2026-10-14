/* Event times from codex_sonic_revision_005, minus the first sample at 0.002 s. */
window.G1_TIMELINE = {
  "duration": 159.66666666666666,
  "phases": [
    {
      "title": "登台与搬运",
      "subtitle": "ARRIVE & CARRY",
      "actions": [
        {
          "label": "自然站立",
          "start": 0,
          "source_event": "initial_stand"
        },
        {
          "label": "迈步登上舞台",
          "start": 1.5,
          "source_event": "stage_entry"
        },
        {
          "label": "走向俯卧撑支架",
          "start": 5.544,
          "source_event": "approach"
        },
        {
          "label": "小步接近支架",
          "start": 13.47,
          "source_event": "approach_fine"
        },
        {
          "label": "停步站稳",
          "start": 19.44,
          "source_event": "recover"
        },
        {
          "label": "准备拾取",
          "start": 22.19,
          "source_event": "prepare_grasp"
        },
        {
          "label": "弯腰拾取支架",
          "start": 26.192,
          "source_event": "crouch"
        },
        {
          "label": "双手握紧支架",
          "start": 34.492,
          "source_event": "close_grasp"
        },
        {
          "label": "持架起身",
          "start": 36.79,
          "source_event": "pickup"
        },
        {
          "label": "原地转向舞台中心",
          "start": 44.792,
          "source_event": "turn_center"
        },
        {
          "label": "走向舞台中心",
          "start": 46.102,
          "source_event": "carry_center"
        }
      ],
      "start": 0
    },
    {
      "title": "放置与展示",
      "subtitle": "PLACE & POSE",
      "actions": [
        {
          "label": "停步调整站姿",
          "start": 54.452,
          "source_event": "recover"
        },
        {
          "label": "转向正前方",
          "start": 57.2,
          "source_event": "turn_front"
        },
        {
          "label": "弯腰放置支架",
          "start": 64.772,
          "source_event": "lower"
        },
        {
          "label": "松手离开支架",
          "start": 76.194,
          "source_event": "open"
        },
        {
          "label": "起身自然站立",
          "start": 80.992,
          "source_event": "rise_empty"
        },
        {
          "label": "保持自然站姿",
          "start": 88.994,
          "source_event": "natural_stand"
        },
        {
          "label": "秀肌肉",
          "start": 91.994,
          "source_event": "flex"
        },
        {
          "label": "恢复自然站立",
          "start": 95.994,
          "source_event": "return_natural"
        }
      ],
      "start": 54.452
    },
    {
      "title": "支架俯卧撑",
      "subtitle": "REACH & PUSH UP",
      "actions": [
        {
          "label": "蹲下",
          "start": 103.198,
          "source_event": "crouch"
        },
        {
          "label": "调整双手朝向",
          "start": 111.402,
          "source_event": "orient_open_hands"
        },
        {
          "label": "双臂前伸触架",
          "start": 113.606,
          "source_event": "reach_bars"
        },
        {
          "label": "双手握紧支架",
          "start": 116.61,
          "source_event": "close_grip"
        },
        {
          "label": "稳住支撑姿势",
          "start": 118.314,
          "source_event": "prepare_support"
        },
        {
          "label": "右腿后伸并落稳",
          "start": 121.518,
          "source_event": "right_extend"
        },
        {
          "label": "左腿后伸并落稳",
          "start": 123.422,
          "source_event": "left_extend"
        },
        {
          "label": "曲臂向下",
          "start": 125.326,
          "source_event": "pushup_lower"
        },
        {
          "label": "推起恢复支撑",
          "start": 127.058,
          "source_event": "pushup_raise"
        },
        {
          "label": "收回左腿并落稳",
          "start": 128.762,
          "source_event": "left_return"
        },
        {
          "label": "收回右腿并落稳",
          "start": 130.666,
          "source_event": "right_return"
        },
        {
          "label": "恢复蹲姿",
          "start": 132.57,
          "source_event": "release_crouch"
        },
        {
          "label": "松开双手",
          "start": 135.77,
          "source_event": "open_hands"
        },
        {
          "label": "收回双臂",
          "start": 136.77,
          "source_event": "withdraw_hands"
        },
        {
          "label": "起身站立",
          "start": 139.47,
          "source_event": "stand_up"
        }
      ],
      "start": 103.198
    },
    {
      "title": "跳跃与谢幕",
      "subtitle": "JUMP & FINISH",
      "actions": [
        {
          "label": "站稳准备跳跃",
          "start": 147.67,
          "source_event": "jump"
        },
        {
          "label": "双臂后摆、屈膝",
          "start": 149.17,
          "source": "codex_sonic_revision_005 jump controller and recorded contact timeline"
        },
        {
          "label": "双臂前摆、起身跳跃",
          "start": 150.47,
          "source": "codex_sonic_revision_005 jump controller and recorded contact timeline"
        },
        {
          "label": "自然落地、恢复站立",
          "start": 150.758,
          "source": "codex_sonic_revision_005 jump controller and recorded contact timeline"
        },
        {
          "label": "再次秀肌肉",
          "start": 153.07,
          "source_event": "final_flex"
        }
      ],
      "start": 147.67
    }
  ]
};
