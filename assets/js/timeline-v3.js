/* Event times from codex_sonic_003, minus the first sample at 0.002 s. */
window.G1_TIMELINE = {
  "duration": 164.0,
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
          "label": "停步站稳",
          "start": 19.452,
          "source_event": "recover"
        },
        {
          "label": "准备拾取",
          "start": 22.658,
          "source_event": "prepare_grasp"
        },
        {
          "label": "弯腰拾取支架",
          "start": 26.66,
          "source_event": "crouch"
        },
        {
          "label": "双手握紧支架",
          "start": 34.96,
          "source_event": "close_grasp"
        },
        {
          "label": "持架起身",
          "start": 37.258,
          "source_event": "pickup"
        },
        {
          "label": "原地转向舞台中心",
          "start": 45.26,
          "source_event": "turn_center"
        },
        {
          "label": "走向舞台中心",
          "start": 47.222,
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
          "start": 53.554,
          "source_event": "recover"
        },
        {
          "label": "转向正前方",
          "start": 56.302,
          "source_event": "turn_front"
        },
        {
          "label": "弯腰放置支架",
          "start": 69.498,
          "source_event": "lower"
        },
        {
          "label": "松手离开支架",
          "start": 80.498,
          "source_event": "open"
        },
        {
          "label": "起身自然站立",
          "start": 85.296,
          "source_event": "rise_empty"
        },
        {
          "label": "保持自然站姿",
          "start": 93.298,
          "source_event": "natural_stand"
        },
        {
          "label": "秀肌肉",
          "start": 96.298,
          "source_event": "flex"
        },
        {
          "label": "恢复自然站立",
          "start": 100.298,
          "source_event": "return_natural"
        }
      ],
      "start": 53.554
    },
    {
      "title": "支架俯卧撑",
      "subtitle": "REACH & PUSH UP",
      "actions": [
        {
          "label": "蹲下",
          "start": 107.502,
          "source_event": "crouch"
        },
        {
          "label": "调整双手朝向",
          "start": 115.706,
          "source_event": "orient_open_hands"
        },
        {
          "label": "双臂前伸触架",
          "start": 117.91,
          "source_event": "reach_bars"
        },
        {
          "label": "双手握紧支架",
          "start": 120.914,
          "source_event": "close_grip"
        },
        {
          "label": "稳住支撑姿势",
          "start": 122.618,
          "source_event": "prepare_support"
        },
        {
          "label": "右腿后伸并落稳",
          "start": 125.822,
          "source_event": "right_extend"
        },
        {
          "label": "左腿后伸并落稳",
          "start": 127.726,
          "source_event": "left_extend"
        },
        {
          "label": "曲臂向下",
          "start": 129.63,
          "source_event": "pushup_lower"
        },
        {
          "label": "推起恢复支撑",
          "start": 131.334,
          "source_event": "pushup_raise"
        },
        {
          "label": "收回左腿并落稳",
          "start": 133.038,
          "source_event": "left_return"
        },
        {
          "label": "收回右腿并落稳",
          "start": 134.942,
          "source_event": "right_return"
        },
        {
          "label": "恢复蹲姿",
          "start": 136.846,
          "source_event": "release_crouch"
        },
        {
          "label": "松开双手",
          "start": 140.046,
          "source_event": "open_hands"
        },
        {
          "label": "收回双臂",
          "start": 141.046,
          "source_event": "withdraw_hands"
        },
        {
          "label": "起身站立",
          "start": 143.746,
          "source_event": "stand_up"
        }
      ],
      "start": 107.502
    },
    {
      "title": "跳跃与谢幕",
      "subtitle": "JUMP & FINISH",
      "actions": [
        {
          "label": "站稳准备跳跃",
          "start": 151.946,
          "source_event": "jump"
        },
        {
          "label": "双臂后摆、屈膝",
          "start": 153.446,
          "source": "codex_sonic_003 jump controller and recorded contact timeline"
        },
        {
          "label": "双臂前摆、起身跳跃",
          "start": 154.746,
          "source": "codex_sonic_003 jump controller and recorded contact timeline"
        },
        {
          "label": "自然落地、恢复站立",
          "start": 155.042,
          "source": "codex_sonic_003 jump controller and recorded contact timeline"
        },
        {
          "label": "再次秀肌肉",
          "start": 157.346,
          "source_event": "final_flex"
        }
      ],
      "start": 151.946
    }
  ]
};
